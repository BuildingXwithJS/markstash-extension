/* global chrome */
// store object in storage
const save = obj => new Promise(r => chrome.storage.local.set(obj, r));
const load = obj => new Promise(r => chrome.storage.local.get(obj, r));

const renderLink = link => `- [${link.title}](${link.url})
`;

const render = async () => {
  // init data
  const linksKey = 'links';
  const {links} = await load([linksKey]);

  // get button pointers
  const container = document.getElementById('markdown');
  container.value = `${links.map(renderLink).join('')}`;

  // add action to clear button
  document.getElementById('clearBtn').addEventListener('click', async () => {
    await save({[linksKey]: []});
    container.value = '';
  });
};

render();
