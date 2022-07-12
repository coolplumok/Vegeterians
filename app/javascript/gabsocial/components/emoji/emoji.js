import { autoPlayGif } from '../../initial_state';
import unicodeMapping from './emoji_unicode_mapping_light';
import Trie from 'substring-trie';

const trie = new Trie(Object.keys(unicodeMapping));

const assetHost = process.env.CDN_HOST || '';

const emojify = (str, customEmojis = {}, plain = false, largeEnabled = false, forceLarge) => {
  const originalStr = str
  const tagCharsWithoutEmojis = '<&';
  const tagCharsWithEmojis = Object.keys(customEmojis).length ? '<&:' : '<&';
  let rtn = '', tagChars = tagCharsWithEmojis, invisible = 0;
  let emojiCount = 0
  let hasText = false

  for (;;) {
    let match, i = 0, tag;
    while (i < str.length && (tag = tagChars.indexOf(str[i])) === -1 && (invisible || !(match = trie.search(str.slice(i))))) {
      i += str.codePointAt(i) < 65536 ? 1 : 2;
      let x = trie.search(str.slice(i))
      if (!x && str[i] !== ':') {
        hasText = true
      }
    }

    let size = forceLarge ? 36 : 16;
    let mt = forceLarge ? 2 : -3;

    let rend, replacement = '';
    if (i === str.length) {
      break;
    } else if (str[i] === ':') {
      if (!(() => {
        rend = str.indexOf(':', i + 1) + 1;
        if (!rend) {
          // no pair of ':'
          hasText = true;
          return false;
        }

        const lt = str.indexOf('<', i + 1);
        if (!(lt === -1 || lt >= rend)) {
          // tag appeared before closing ':'
          hasText = true;
          return false;
        }

        const shortname = str.slice(i, rend);
        // now got a replacee as ':shortname:'
        // if you want additional emoji handler, add statements below which set replacement and return true.
        if (shortname in customEmojis) {
          const filename = autoPlayGif ? customEmojis[shortname].url : customEmojis[shortname].static_url;
          replacement = plain ? '' : `<img draggable="false" style="height:${size}px;width:${size}px;margin:${mt}px 0 0;font-family:'object-fit:contain',inherit;vertical-align:middle;-o-object-fit:contain;object-fit:contain;" alt="${shortname}" title="${shortname}" src="${filename}" />`;
          emojiCount++;
          return true;
        }
        hasText = true;
        return false;
      })()) rend = ++i;
    } else if (tag >= 0) { // <, &
      rend = str.indexOf('>;'[tag], i + 1) + 1;
      if (!rend) {
        break;
      }
      if (tag === 0) {
        if (invisible) {
          if (str[i + 1] === '/') { // closing tag
            if (!--invisible) {
              tagChars = tagCharsWithEmojis;
            }
          } else if (str[rend - 2] !== '/') { // opening tag
            invisible++;
          }
        } else {
          if (str.startsWith('<span class="invisible">', i)) {
            // avoid emojifying on invisible text
            invisible = 1;
            tagChars = tagCharsWithoutEmojis;
          }
        }
      }
      i = rend;
    } else { // matched to unicode emoji
      const { filename, shortCode } = unicodeMapping[match];
      const title = shortCode ? `:${shortCode}:` : '';
      replacement = plain ? '' : `<img draggable="false" style="height:${size}px;width:${size}px;margin:${mt}px 0 0;font-family:'object-fit:contain',inherit;vertical-align:middle;-o-object-fit:contain;object-fit:contain;" alt="${match}" title="${title}" src="${assetHost}/emoji/${filename}.svg" />`;
      rend = i + match.length;
      emojiCount++;
      // If the matched character was followed by VS15 (for selecting text presentation), skip it.
      if (str.codePointAt(rend) === 65038) {
        rend += 1;
      }
    }
    rtn += str.slice(0, i) + replacement;
    str = str.slice(rend);
  }

  if (emojiCount < 4 && largeEnabled && !forceLarge && !hasText) {
    return emojify(originalStr, customEmojis, plain, largeEnabled, true);
  }

  return `${rtn + str}`.trim();
};

export default emojify;

export const buildCustomEmojis = (customEmojis) => {
  const emojis = [];

  customEmojis.forEach(emoji => {
    const shortcode = emoji.get('shortcode');
    const url       = autoPlayGif ? emoji.get('url') : emoji.get('static_url');
    const name      = shortcode.replace(':', '');

    emojis.push({
      id: name,
      name,
      short_names: [name],
      text: '',
      emoticons: [],
      keywords: [name],
      imageUrl: url,
      custom: true,
    });
  });

  return emojis;
};