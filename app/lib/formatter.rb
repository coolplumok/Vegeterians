# frozen_string_literal: true

require 'singleton'
require_relative './sanitize_config'

class HTMLRenderer < Redcarpet::Render::HTML
  def block_code(code, language)
    "<pre><code>#{encode(code).gsub("\n", "<br/>")}</code></pre>"
  end

  def block_quote(quote)
    "<blockquote>#{quote}</blockquote>"
  end

  def codespan(code)
    "<code>#{encode(code).gsub("\n", "<br/>")}</code>"
  end

  def double_emphasis(text)
    "<strong>#{text}</strong>"
  end
  
  def emphasis(text)
    "<em>#{text}</em>"
  end
  
  def header(text, header_level)
    "<h1>#{text}</h1>"
  end

  def paragraph(text)
    "<p>#{text}</p>"
  end
  
  def triple_emphasis(text)
    "<b><em>#{text}</em></b>"
  end
  
  def strikethrough(text)
    "<del>#{text}</del>"
  end
  
  def underline(text)
    "<u>#{text}</u>"
  end

  def list(contents, list_type)
    if list_type == :ordered
      "<ol>#{contents}</ol>"
    elsif list_type == :unordered
      "<ul>#{contents}</ul>"
    else
      content
    end
  end
  
  def list_item(text, list_type)
    "<li>#{text}</li>"
  end

  def autolink(link, link_type)
    return link if link_type == :email
    Formatter.instance.link_url(link)
  end

  private

  def html_entities
    @html_entities ||= HTMLEntities.new
  end

  def encode(html)
    html_entities.encode(html)
  end
end

class Formatter
  include Singleton
  include RoutingHelper

  include ActionView::Helpers::TextHelper

  def format(status, **options)
    if options[:use_markdown]
      raw_content = status.markdown
      return '' if raw_content.blank?
    else
      raw_content = status.text
    end

    raw_content = ActionController::Base.helpers.strip_tags(raw_content) if status.id <= 11063737261633602 # #TODO: Migration fix

    if status.reblog?
      status = status.proper
    end

    if options[:inline_poll_options] && status.preloadable_poll
      raw_content = raw_content + "\n\n" + status.preloadable_poll.options.map { |title| "[ ] #{title}" }.join("\n")
    end

    return '' if raw_content.blank?

    unless status.local?
      html = reformat(raw_content)
      html = encode_custom_emojis(html, status.emojis, options[:autoplay]) if options[:custom_emojify]
      return html.html_safe # rubocop:disable Rails/OutputSafety
    end

    linkable_accounts = status.active_mentions.map(&:account)
    linkable_accounts << status.account

    html = raw_content
    html = format_markdown(html) if options[:use_markdown]
    html = encode_and_link_urls(html, linkable_accounts, keep_html: options[:use_markdown])
    html = reformat(html, true) unless options[:use_markdown]
    html = encode_custom_emojis(html, status.emojis, options[:autoplay]) if options[:custom_emojify]

    unless options[:use_markdown]
      html = html.gsub(/(?:\n\r?|\r\n?)/, '<br />')
      html = html.delete("\n")
    end

    html.html_safe # rubocop:disable Rails/OutputSafety

    html
  end

  def format_markdown(html)
    html = markdown_formatter.render(html)
    html = html.gsub(/\n/, '<br />')
    html.delete("\r").delete("\n")
    html
  end

  def reformat(html, outgoing = false)
    sanitize(html, Sanitize::Config::GABSOCIAL_STRICT.merge(outgoing: outgoing))
  rescue ArgumentError
    ''
  end

  def plaintext(status)
    return status.text if status.local?

    text = status.text.gsub(/(<br \/>|<br>|<\/p>)+/) { |match| "#{match}\n" }
    strip_tags(text)
  end

  def simplified_format(account, **options)
    html = account.local? ? linkify(account.note) : reformat(account.note)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def sanitize(html, config)
    Sanitize.fragment(html, config)
  end

  def format_spoiler(status, **options)
    html = encode(status.spoiler_text)
    html = encode_custom_emojis(html, status.emojis, options[:autoplay])
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_poll_option(status, option, **options)
    html = encode(option.title)
    html = encode_custom_emojis(html, status.emojis, options[:autoplay])
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_display_name(account, **options)
    html = encode(account.display_name.presence || account.username)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_field(account, str, **options)
    html = account.local? ? encode_and_link_urls(str, me: true) : reformat(str)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def linkify(text)
    html = encode_and_link_urls(text)
    html = simple_format(html, {}, sanitize: false)
    html = html.delete("\n")

    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def link_url(url)
    "<a href=\"#{encode(url)}\" target=\"blank\" rel=\"nofollow noopener noreferrer\">#{link_html(url)}</a>"
  end

  private

  def markdown_formatter
    extensions = {
      autolink: false,
      no_intra_emphasis: true,
      fenced_code_blocks: true,
      disable_indented_code_blocks: true,
      strikethrough: true,
      lax_spacing: true,
      space_after_headers: true,
      superscript: false,
      underline: true,
      highlight: false,
      footnotes: false,
    }

    renderer = HTMLRenderer.new({
      filter_html: false,
      escape_html: false,
      no_images: true,
      no_styles: true,
      safe_links_only: false,
      hard_wrap: false,
      no_links: true,
      with_toc_data: false,
      prettify: false,
      link_attributes: nil
    })

    Redcarpet::Markdown.new(renderer, extensions)
  end

  def html_entities
    @html_entities ||= HTMLEntities.new
  end

  def encode(html)
    html_entities.encode(html)
  end

  def encode_and_link_urls(html, accounts = nil, options = {})
    entities = utf8_friendly_extractor(html, extract_url_without_protocol: false)

    if accounts.is_a?(Hash)
      options  = accounts
      accounts = nil
    end

    rewrite(html.dup, entities, options[:keep_html]) do |entity|
      if entity[:url]
        link_to_url(entity, options)
      elsif entity[:hashtag]
        link_to_hashtag(entity)
      elsif entity[:screen_name]
        link_to_mention(entity, accounts)
      end
    end
  end

  def count_tag_nesting(tag)
    if tag[1] == '/' then -1
    elsif tag[-2] == '/' then 0
    else 1
    end
  end

  def encode_custom_emojis(html, emojis, animate = false)
    return html if emojis.empty?

    emoji_map = if animate
                  emojis.each_with_object({}) { |e, h| h[e.shortcode] = full_asset_url(e.image.url) }
                else
                  emojis.each_with_object({}) { |e, h| h[e.shortcode] = full_asset_url(e.image.url(:static)) }
                end

    i                     = -1
    tag_open_index        = nil
    inside_shortname      = false
    shortname_start_index = -1
    invisible_depth       = 0

    while i + 1 < html.size
      i += 1

      if invisible_depth.zero? && inside_shortname && html[i] == ':'
        shortcode = html[shortname_start_index + 1..i - 1]
        emoji     = emoji_map[shortcode]

        if emoji
          replacement = "<img draggable=\"false\" class=\"emojione\" alt=\":#{encode(shortcode)}:\" title=\":#{encode(shortcode)}:\" src=\"#{encode(emoji)}\" />"
          before_html = shortname_start_index.positive? ? html[0..shortname_start_index - 1] : ''
          html        = before_html + replacement + html[i + 1..-1]
          i          += replacement.size - (shortcode.size + 2) - 1
        else
          i -= 1
        end

        inside_shortname = false
      elsif tag_open_index && html[i] == '>'
        tag = html[tag_open_index..i]
        tag_open_index = nil
        if invisible_depth.positive?
          invisible_depth += count_tag_nesting(tag)
        elsif tag == '<span class="invisible">'
          invisible_depth = 1
        end
      elsif html[i] == '<'
        tag_open_index   = i
        inside_shortname = false
      elsif !tag_open_index && html[i] == ':'
        inside_shortname      = true
        shortname_start_index = i
      end
    end

    html
  end

  def rewrite(text, entities, keep_html = false)
    text = text.to_s

    # Sort by start index
    entities = entities.sort_by do |entity|
      indices = entity.respond_to?(:indices) ? entity.indices : entity[:indices]
      indices.first
    end

    result = []

    last_index = entities.reduce(0) do |index, entity|
      indices = entity.respond_to?(:indices) ? entity.indices : entity[:indices]
      result << (keep_html ? text[index...indices.first] : encode(text[index...indices.first]))
      result << yield(entity)
      indices.last
    end

    result << (keep_html ? text[last_index..-1] : encode(text[last_index..-1]))

    result.flatten.join
  end

  UNICODE_ESCAPE_BLACKLIST_RE = /\p{Z}|\p{P}/

  def utf8_friendly_extractor(text, options = {})
    old_to_new_index = [0]

    escaped = text.chars.map do |c|
      output = begin
        if c.ord.to_s(16).length > 2 && UNICODE_ESCAPE_BLACKLIST_RE.match(c).nil?
          CGI.escape(c)
        else
          c
        end
      end

      old_to_new_index << old_to_new_index.last + output.length

      output
    end.join

    # Note: I couldn't obtain list_slug with @user/list-name format
    # for mention so this requires additional check
    special = Extractor.extract_urls_with_indices(escaped, options).map do |extract|
      new_indices = [
        old_to_new_index.find_index(extract[:indices].first),
        old_to_new_index.find_index(extract[:indices].last),
      ]

      next extract.merge(
        indices: new_indices,
        url: text[new_indices.first..new_indices.last - 1]
      )
    end

    standard = Extractor.extract_entities_with_indices(text, options)

    Extractor.remove_overlapping_entities(special + standard)
  end

  def html_friendly_extractor(html, options = {})
    gaps = []
    total_offset = 0

    escaped = html.gsub(/<[^>]*>|&#[0-9]+;/) do |match|
      total_offset += match.length - 1
      end_offset = Regexp.last_match.end(0)
      gaps << [end_offset - total_offset, total_offset]
      "\u200b"
    end

    entities = Extractor.extract_hashtags_with_indices(escaped, :check_url_overlap => false) +
               Extractor.extract_mentions_or_lists_with_indices(escaped)
    Extractor.remove_overlapping_entities(entities).map do |extract|
      pos = extract[:indices].first
      offset_idx = gaps.rindex { |gap| gap.first <= pos }
      offset = offset_idx.nil? ? 0 : gaps[offset_idx].last
      next extract.merge(
        :indices => [extract[:indices].first + offset, extract[:indices].last + offset]
      )
    end
  end

  def link_to_url(entity, options = {})
    url        = Addressable::URI.parse(entity[:url])
    html_attrs = { target: '_blank', rel: 'nofollow noopener noreferrer' }

    html_attrs[:rel] = "me #{html_attrs[:rel]}" if options[:me]

    Twitter::Autolink.send(:link_to_text, entity, link_html(entity[:url]), url, html_attrs)
  rescue Addressable::URI::InvalidURIError, IDN::Idna::IdnaError
    encode(entity[:url])
  end

  def link_to_mention(entity, linkable_accounts)
    acct = entity[:screen_name]

    return link_to_account(acct) unless linkable_accounts

    account = linkable_accounts.find { |item| TagManager.instance.same_acct?(item.acct, acct) }
    account ? mention_html(account) : "@#{encode(acct)}"
  end

  def link_to_account(acct)
    username, domain = acct.split('@')

    domain  = nil if TagManager.instance.local_domain?(domain)
    account = EntityCache.instance.mention(username, domain)

    account ? mention_html(account) : "@#{encode(acct)}"
  end

  def link_to_hashtag(entity)
    hashtag_html(entity[:hashtag])
  end

  def link_html(url)
    url    = Addressable::URI.parse(url).to_s
    prefix = url.match(/\Ahttps?:\/\/(www\.)?/).to_s
    text   = url[prefix.length, 45]
    suffix = url[prefix.length + 45..-1]
    cutoff = url[prefix.length..-1].length > 45

    "<span aria-hidden=\"true\" class=\"invisible\">#{encode(prefix)}</span>#{encode(text)}<span aria-hidden=\"true\" class=\"invisible\">#{encode(suffix)}</span>" + (cutoff ? "<span aria-hidden=\"true\" class=\"ellipsis\"></span>" : "")
  end

  def hashtag_html(tag)
    "<a data-focusable=\"true\" role=\"link\" href=\"#{encode(tag_url(tag.downcase))}\" class=\"mention hashtag\" rel=\"tag\">##{encode(tag)}</a>"
  end

  def mention_html(account)
    return "<span>@#{encode(account.acct)}</span>" unless account.local?
    "<a data-focusable=\"true\" role=\"link\" href=\"#{encode(TagManager.instance.url_for(account))}\" class=\"u-url mention\">@#{encode(account.acct)}</a>"
  end

end