/* global chrome */

const tabQueryConfig = {
  active: true,
  currentWindow: true,
};

// get current tab url and title
const getActiveTabs = () => new Promise(r => chrome.tabs.query(tabQueryConfig, r));

// store object in storage
const save = obj => new Promise(r => chrome.storage.local.set(obj, r));
const load = obj => new Promise(r => chrome.storage.local.get(obj, r));

(async () => {
  // init data
  const linksKey = 'links';
  const {links} = await load([linksKey]);
  if (!links) {
    await save({[linksKey]: []});
  }

  // get button pointers
  const addBtn = document.getElementById('addBtn');
  const stashBtn = document.getElementById('stashBtn');
  const exportBtn = document.getElementById('exportBtn');

  addBtn.addEventListener('click', async () => {
    const tabs = await getActiveTabs();
    const {url, title} = tabs[0];
    const {links: savedLinks} = await load(['links']);
    savedLinks.push({url, title});
    await save({[linksKey]: savedLinks});
    window.close();
  });

  stashBtn.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL('stash.html')});
  });

  exportBtn.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL('export.html')});
  });
})();
