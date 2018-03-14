/* global chrome */
// store object in storage
const save = obj => new Promise(r => chrome.storage.local.set(obj, r));
const load = obj => new Promise(r => chrome.storage.local.get(obj, r));

const renderLink = link => `<li>
  <a href="${link.url}" class="link">${link.title}</a>
  <a href="#" class="button is-white remove">[x]</a>
</li>`;

const render = async () => {
  // init data
  const linksKey = 'links';
  const {links} = await load([linksKey]);

  // get button pointers
  const container = document.getElementById('container');

  if (!links.length) {
    container.innerHTML = '<h2>No links stored yet!</h2>';
    return;
  }

  container.innerHTML = `
<ul>
  ${links.map(renderLink).join('')}
</ul>
`;

  const removeBtns = Array.from(document.getElementsByClassName('remove'));
  const btnListeners = [];

  removeBtns.forEach((el, index) => {
    const handler = async () => {
      const linkEl = el.parentElement.getElementsByClassName('link')[0];
      const url = linkEl.getAttribute('href');
      const newLinks = links.filter(l => l.url !== url);
      await save({[linksKey]: newLinks});
      // cleanup
      removeBtns.forEach((elm, idx) => elm.removeEventListener('click', btnListeners[idx]));
      // re-render
      render();
    };
    btnListeners[index] = handler;
    el.addEventListener('click', handler, {passive: false});
  });
};

render();
