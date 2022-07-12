import escapeTextContentForBrowser from 'escape-html'
import marked from 'marked';
import emojify from '../../components/emoji/emoji'
import { unescapeHTML } from '../../utils/html'
import { expandSpoilers } from '../../initial_state'

const domParser = new DOMParser()

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

const loopLimitedNoteEmojified = (emojified_node, emojified_arry) => {
  for (let node_index = 0; node_index < emojified_node.childNodes.length; node_index++) {
    if (emojified_node.childNodes[node_index].nodeType != 3) {
      if (emojified_node.childNodes[node_index].childNodes[0] != undefined) {
        emojified_arry.html += '<' + emojified_node.childNodes[node_index].nodeName.toLowerCase() + '>'
        emojified_arry = loopLimitedNoteEmojified(emojified_node.childNodes[node_index], emojified_arry);
        emojified_arry.html += '</' + emojified_node.childNodes[node_index].nodeName.toLowerCase() + '>'
      }
    } else {
      if (emojified_node.childNodes[node_index].nodeValue) {
        const limited_note_emojified_length = 300
        let addable_length = limited_note_emojified_length - emojified_arry.plain.length
        if (addable_length > 0) {
          if (addable_length > emojified_node.childNodes[node_index].nodeValue.length) addable_length = emojified_node.childNodes[node_index].nodeValue.length
        } else {
          addable_length = 0
        }
        emojified_arry.html += emojified_node.childNodes[node_index].nodeValue.substring(0, addable_length);
        emojified_arry.plain += emojified_node.childNodes[node_index].nodeValue.substring(0, addable_length);
      }
    }
  }
  return emojified_arry
}

const getLimitedNoteEmojified = emojified => {
  let limitedNoteEmojifiedResult = {"plain": "", "html": ""}
  const parseNote = domParser.parseFromString(emojified, 'text/html').documentElement
  if (parseNote.childNodes[1]) {
    if (parseNote.childNodes[1]) {
      limitedNoteEmojifiedResult = loopLimitedNoteEmojified(parseNote.childNodes[1], limitedNoteEmojifiedResult)
    }
  }
  return limitedNoteEmojifiedResult.html
}

const emitPTagFromEmojified = emojified => {
  let emojifiedResult = emojified.trim()
  if (emojifiedResult.substring(0, 3) == '<p>' && emojifiedResult.substring(emojifiedResult.length - 4) == '</p>') {
    emojifiedResult = emojifiedResult.substring(3, emojifiedResult.length - 4)
  }

  return emojifiedResult
}

export function normalizeAccount(account) {
  account = { ...account };

  const emojiMap = makeEmojiMap(account);
  const displayName = account.display_name.trim().length === 0 ? account.username : account.display_name;

  account.display_name_html = emojify(escapeTextContentForBrowser(displayName), emojiMap);
  account.display_name_plain = emojify(escapeTextContentForBrowser(displayName), emojiMap, true);
  account.note_emojified = emitPTagFromEmojified(emojify(marked(unescapeHTML(account.note)), emojiMap));
  account.limited_note_emojified = emitPTagFromEmojified(getLimitedNoteEmojified(account.note_emojified));
  account.note_plain = unescapeHTML(account.note)

  if (account.fields) {
    account.fields = account.fields.map(pair => ({
      ...pair,
      name_emojified: emojify(escapeTextContentForBrowser(pair.name)),
      value_emojified: emojify(pair.value, emojiMap),
      value_plain: unescapeHTML(pair.value),
    }));
  }

  if (account.moved) {
    account.moved = account.moved.id;
  }

  return account;
}

export function normalizeStatus(status, normalOldStatus) {
  const normalStatus   = { ...status };
  normalStatus.account = status.account.id;

  if (status.reblog && status.reblog.id) {
    normalStatus.reblog = status.reblog.id;
  }

  if (status.quote && status.quote.id) {
    normalStatus.quote = status.quote.id;
  }

  if (status.poll && status.poll.id) {
    normalStatus.poll = status.poll.id;
  }

  // Only calculate these values when status first encountered
  // Otherwise keep the ones already in the reducer
  if (normalOldStatus && normalOldStatus.get('content') === normalStatus.content && normalOldStatus.get('spoiler_text') === normalStatus.spoiler_text) {
    normalStatus.search_index = normalOldStatus.get('search_index');
    normalStatus.contentHtml = normalOldStatus.get('contentHtml');
    normalStatus.spoilerHtml = normalOldStatus.get('spoilerHtml');
    normalStatus.hidden = normalOldStatus.get('hidden');
  } else {
    const spoilerText   = normalStatus.spoiler_text || '';
    const searchContent = [spoilerText, status.content].join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n');
    const emojiMap      = makeEmojiMap(normalStatus);
    const theContent = !!normalStatus.rich_content ? normalStatus.rich_content : normalStatus.content;

    normalStatus.search_index = domParser.parseFromString(searchContent, 'text/html').documentElement.textContent;
    normalStatus.contentHtml  = emojify(theContent, emojiMap, false, true);
    normalStatus.spoilerHtml  = emojify(escapeTextContentForBrowser(spoilerText), emojiMap);
    normalStatus.hidden       = expandSpoilers ? false : spoilerText.length > 0 || normalStatus.sensitive;
  }

  return normalStatus;
}

export function normalizePoll(poll) {
  const normalPoll = { ...poll };

  const emojiMap = makeEmojiMap(normalPoll);

  normalPoll.options = poll.options.map(option => ({
    ...option,
    title_emojified: emojify(escapeTextContentForBrowser(option.title), emojiMap),
  }));

  return normalPoll;
}

export function normalizeGroup(group) {
  const normalGroup = { ...group };

  return normalGroup;
}