import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);

/**
 * Reads the innerHTML of `sourceEl` and renders it as escaped text
 * inside a <pre><code> block appended to `targetEl`.
 *
 * @param {Element} sourceEl  - Element whose HTML you want to display
 * @param {Element} targetEl  - Element to append the <pre><code> block into
 * @param {object}  [options]
 * @param {string}  [options.label]  - Optional heading above the code block
 * @param {boolean} [options.outer]  - Use outerHTML instead of innerHTML (default: false)
 */
export const renderSource = (sourceEl, targetEl, { label, outer = false } = {}) => {
  const raw = outer ? sourceEl.outerHTML : sourceEl.innerHTML;
  const dedented = dedent(raw);
  const highlighted = hljs.highlight(dedented, { language: 'html' }).value;

  targetEl.appendChild(buildBlock(label, highlighted));
}

/**
 * Reads the textContent of a <style> element and renders it as a CSS
 * <pre><code> block appended to `targetEl`.
 *
 * @param {HTMLStyleElement} styleEl  - The <style> element to display
 * @param {Element}          targetEl - Element to append the <pre><code> block into
 * @param {object}           [options]
 * @param {string}           [options.label] - Optional heading above the code block
 */
export const renderStyle = (styleEl, targetEl, { label } = {}) => {
  const dedented = dedent(styleEl.textContent);
  const highlighted = hljs.highlight(dedented, { language: 'css' }).value;

  targetEl.appendChild(buildBlock(label, highlighted));
}

/**
 * Fetches a JS file by URL and renders its source as a <pre><code> block
 * appended to `targetEl`.
 *
 * @param {string}  url       - Path to the JS file (e.g. '/js/components/simple-button.js')
 * @param {Element} targetEl  - Element to append the <pre><code> block into
 * @param {object}  [options]
 * @param {string}  [options.label] - Optional heading above the code block
 */
export const renderScript = async (url, targetEl, { label } = {}) => {
  const res = await fetch(url);
  const raw = await res.text();
  const text = raw.replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, '');
  const highlighted = hljs.highlight(text, { language: 'javascript' }).value;

  targetEl.appendChild(buildBlock(label, highlighted));
}

/**
 * Strips the common leading whitespace from a multiline string
 * so indentation from the HTML source doesn't bloat the output.
 */
const dedent = (str) => {
  const lines = str.split('\n');
  const nonEmpty = lines.filter((line) => line.trim().length > 0);
  const minIndent = Math.min(...nonEmpty.map((line) => line.match(/^(\s*)/)[1].length));
  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim();
}

const buildBlock = (label, highlightedHtml) => {
  const wrapper = document.createElement('section');
  wrapper.className = 'source-block';

  const pre = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'hljs';
  code.innerHTML = highlightedHtml;
  pre.appendChild(code);
  wrapper.appendChild(pre);
  return wrapper;
}
