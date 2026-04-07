export const attachShadow = () => {
  const section = document.querySelector('#demo-html');
  const shadow = section.shadowRoot
    ? section.shadowRoot
    : section.attachShadow({ mode: 'open' });

  const newQuote = document.createElement('blockquote');
  newQuote.textContent = '"The more you share, the more your bowl will be plentiful."';

  const author = document.createElement('p');
  author.textContent = '- James S.A. Corey, ';

  const cite = document.createElement('cite');
  cite.textContent = 'The Expanse';
  author.appendChild(cite);

  shadow.appendChild(newQuote);
  shadow.appendChild(author);
  return shadow;
};

export const attachWithStyle = (styleId) => {
  const shadow = attachShadow();
  const style = document.querySelector(`#${styleId}`);
  shadow.appendChild(style);

}
