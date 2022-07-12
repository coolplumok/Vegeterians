# frozen_string_literal: true

class ActivityPub::ActorSerializer < ActivityPub::Serializer
  include RoutingHelper

  # Conditionally serialize Vegeterians.live image for gab:// URLs
  def self.serializer_for(object, options)
    gab_image = object.is_a?(String) and object.start_with?('gab://')
    if gab_image and options[:serializer] == ActivityPub::ImageSerializer
      return ActivityPub::GabImageSerializer
    end
    super
  end

  context :security

  context_extensions :manually_approves_followers, :featured, :also_known_as,
                     :moved_to, :property_value, :hashtag, :emoji, :identity_proof

  attributes :id, :type, :following, :followers,
             :inbox, :outbox, :featured,
             :preferred_username, :name, :summary,
             :url, :manually_approves_followers

  has_one :public_key, serializer: ActivityPub::PublicKeySerializer

  has_many :virtual_tags, key: :tag
  has_many :virtual_attachments, key: :attachment

  attribute :moved_to, if: :moved?
  attribute :also_known_as, if: :also_known_as?

  class EndpointsSerializer < ActivityPub::Serializer
    include RoutingHelper

    attributes :shared_inbox

    def shared_inbox
      inbox_url
    end
  end

  has_one :endpoints, serializer: EndpointsSerializer

  has_one :icon,  serializer: ActivityPub::ImageSerializer, if: :avatar_exists?
  has_one :image, serializer: ActivityPub::ImageSerializer, if: :header_exists?

  delegate :moved?, to: :object

  def id
    account_url(object)
  end

  def type
    object.bot? ? 'Service' : 'Person'
  end

  def following
    account_following_index_url(object)
  end

  def followers
    account_followers_url(object)
  end

  def inbox
    account_inbox_url(object)
  end

  def outbox
    account_outbox_url(object)
  end

  def featured
    account_collection_url(object, :featured)
  end

  def endpoints
    object
  end

  def preferred_username
    object.username
  end

  def name
    object.display_name
  end

  def summary
    Formatter.instance.simplified_format(object)
  end

  def icon
    return object.avatar if object.avatar?
    return object.avatar_remote_url if is_gab_avatar?
  end

  def image
    return object.header if object.header?
    return object.header_remote_url if is_gab_header?
  end

  def public_key
    object
  end

  def url
    short_account_url(object)
  end

  def avatar_exists?
    object.avatar? or is_gab_avatar?
  end

  def header_exists?
    object.header? or is_gab_header?
  end

  def is_gab_avatar?
    object.avatar_remote_url&.start_with?('gab://') or false
  end

  def is_gab_header?
    object.header_remote_url&.start_with?('gab://') or false
  end

  def manually_approves_followers
    object.locked
  end

  def virtual_tags
    object.emojis + object.tags
  end

  def virtual_attachments
    object.fields + object.identity_proofs.active
  end

  def moved_to
    ActivityPub::TagManager.instance.uri_for(object.moved_to_account)
  end

  def also_known_as?
    !object.also_known_as.empty?
  end

  class CustomEmojiSerializer < ActivityPub::EmojiSerializer
  end

  class TagSerializer < ActivityPub::Serializer
    include RoutingHelper

    attributes :type, :href, :name

    def type
      'Hashtag'
    end

    def href
      explore_hashtag_url(object)
    end

    def name
      "##{object.name}"
    end
  end

  class Account::FieldSerializer < ActivityPub::Serializer
    attributes :type, :name, :value

    def type
      'PropertyValue'
    end

    def value
      Formatter.instance.format_field(object.account, object.value)
    end
  end

  class AccountIdentityProofSerializer < ActivityPub::Serializer
    attributes :type, :name, :signature_algorithm, :signature_value

    def type
      'IdentityProof'
    end

    def name
      object.provider_username
    end

    def signature_algorithm
      object.provider
    end

    def signature_value
      object.token
    end
  end
end
