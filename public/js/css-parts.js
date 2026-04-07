export const applyStyles = () => {
  const result = document.querySelector('#style-result');

  document.querySelector('#demo-html').classList.add('styles-applied');

  result.hidden = false;
  result.textContent = '⚠️ The plain HTML articles updated — but the Canterbury (custom element) did not.'
    + ' Regular CSS selectors cannot pierce the shadow boundary. The component exposes no ::part() hooks yet.';
};

export const addPartStyles = () => {
  const sheet = document.querySelector('#demo-style').sheet;

  sheet.insertRule(
    'ship-article::part(headline) { color: var(--color-primary); }',
    sheet.cssRules.length,
  );

  sheet.insertRule(
    'ship-article::part(summary) { border-left-color: var(--color-primary); color: #0a0a0a; }',
    sheet.cssRules.length,
  );

  const result = document.querySelector('#style-result');
  result.hidden = false;
  result.textContent = '✅ ::part() selectors added to the stylesheet. The Canterbury headline and summary'
    + ' are now styled — the component author opted in by adding part attributes to those elements.';

  document.querySelector('#add-part-styles').disabled = true;
};
