browser.browserAction.onClicked.addListener(() => {
  console.log("PostCrossing Tab Sorter clicked!");
  sortPostcrossingTabs("asc").catch(err => console.error(err));
});

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "sort") {
    sortPostcrossingTabs(msg.order).catch(err => console.error(err));
  }
});

async function sortPostcrossingTabs(order = "asc") {
  const tabs = await browser.tabs.query({});
  const regex = /postcards\/[A-Z]{1,3}-(\d+)/i;

  const pcTabs = tabs
    .map(t => ({ tab: t, match: (t.url || "").match(regex) }))
    .filter(x => x.match)
    .map(x => ({
      id: x.tab.id,
      windowId: x.tab.windowId,
      index: x.tab.index,
      num: parseInt(x.match[1], 10),
    }));

  if (!pcTabs.length) {
    console.log("No PostCrossing postcard tabs found.");
    return;
  }

  pcTabs.sort((a, b) => (order === "asc" ? a.num - b.num : b.num - a.num));

  const byWindow = {};
  pcTabs.forEach(t => {
    if (!byWindow[t.windowId]) byWindow[t.windowId] = [];
    byWindow[t.windowId].push(t);
  });

  for (const windowIdStr of Object.keys(byWindow)) {
    const windowId = Number(windowIdStr);
    const windowTabs = byWindow[windowId];
    const targetStart = Math.min(...windowTabs.map(t => t.index));

    for (let i = 0; i < windowTabs.length; i++) {
      const t = windowTabs[i];
      try {
        await browser.tabs.move(t.id, { windowId: windowId, index: targetStart + i });
      } catch (e) {
        console.error("Move error", e);
      }
    }
  }

  console.log("Sorted PostCrossing tabs.");
}
