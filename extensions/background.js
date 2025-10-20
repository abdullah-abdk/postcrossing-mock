// background.js
// Works in Firefox (browser.* API)
console.log("Background loaded - PostCrossing Tools");

browser.browserAction.onClicked.addListener(() => {
  // If no popup desired on click, you can trigger a default action.
  console.log("Extension icon clicked");
});

// Helper: parse postcard code from URL like /postcards/CN-4087990
function extractPostcardCode(url) {
  try {
    const m = url.match(/postcards\/([A-Z]{1,3}-\d+)/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;
  }
}


// Hybrid search with strict AND logic
async function hybridSearch({ query = '', mode = 'or' } = {}) {
  const tabs = await browser.tabs.query({});
  const q = (query || '').trim();
  if (!q) return [];

  const words = q.split(/\s+/).map(w => w.toLowerCase());
  const results = [];

  for (const t of tabs) {
    const url = (t.url || '').toLowerCase();
    const title = (t.title || '').toLowerCase();

    const codeMatch = url.match(/postcards\/([a-z]{1,3}-\d+)/i);
    const code = codeMatch ? codeMatch[1].toUpperCase() : null;

    // URL-based check
    let urlMatched = false;
    if (code) {
      const codeLower = code.toLowerCase();
      if (q.toLowerCase().includes(codeLower) || url.includes(codeLower)) {
        urlMatched = true;
      } else {
        // also accept if any word looks like a code part (letters + digits)
        for (const w of words) {
          if (/[a-z]-?\d+/.test(w) && url.includes(w)) urlMatched = true;
        }
      }
    }

    // Title-based check (ignore code-like parts)
    let titleMatched = false;
    for (const w of words) {
      if (!/[a-z]-?\d+/i.test(w) && title.includes(w)) titleMatched = true;
    }

    let matched = false;
    if (mode === 'and') {
      // must contain at least one title word and one code/URL match
      matched = false;

      // Separate query words into code-like and normal words
      const codeWord = words.find(w => /[a-z]{1,3}-?\d*/i.test(w));  // e.g. CN or CN-12345
      const textWord = words.find(w => !/[a-z]{1,3}-?\d*/i.test(w)); // e.g. postcard, swap, wall

      if (codeWord && textWord) {
        // must have both in respective places
        matched = url.includes(codeWord.toLowerCase()) && title.includes(textWord.toLowerCase());
      } else if (codeWord) {
        // if only code given
        matched = url.includes(codeWord.toLowerCase());
      } else if (textWord) {
        // if only text word given
        matched = title.includes(textWord.toLowerCase());
      }
    } else {
      // OR: match either
      matched = urlMatched || titleMatched;
    }

    if (matched) {
      results.push({
        id: t.id,
        windowId: t.windowId,
        index: t.index,
        title: t.title,
        url: t.url,
        code,
      });
    }
  }

  // Sort (postcards with code first)
  results.sort((a, b) => {
    const aHasCode = a.code ? 1 : 0;
    const bHasCode = b.code ? 1 : 0;
    if (aHasCode !== bHasCode) return bHasCode - aHasCode;
    return a.index - b.index;
  });

  return results;
}

// Move multiple tabs within the same window to target positions (keeps relative ordering)
async function moveTabsInWindow(windowId, tabIds, targetStartIndex) {
  for (let i = 0; i < tabIds.length; i++) {
    const id = tabIds[i];
    try {
      await browser.tabs.move(id, { windowId, index: targetStartIndex + i });
    } catch (e) {
      console.error('Move error', e);
    }
  }
}

// Focus a specific tab
async function focusTab(tabId, windowId) {
  try {
    await browser.windows.update(windowId, { focused: true });
    await browser.tabs.update(tabId, { active: true });
  } catch (e) {
    console.error('Focus error', e);
  }
}

// Receive messages from popup
browser.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || !msg.action) return;

  if (msg.action === 'search') {
    const { query, mode } = msg;
    return hybridSearch({ query, mode }).then(results => ({ results }));
  }

  if (msg.action === 'sort') {
    // keep your old sort logic - default asc
    const order = msg.order || 'asc';
    return (async () => {
      const tabs = await browser.tabs.query({});
      const regex = /postcards\/[A-Z]{1,3}-(\d+)/i;
      const pcTabs = tabs
        .map(t => ({ tab: t, match: (t.url || '').match(regex) }))
        .filter(x => x.match)
        .map(x => ({ id: x.tab.id, windowId: x.tab.windowId, index: x.tab.index, num: parseInt(x.match[1], 10) }));

      pcTabs.sort((a, b) => (order === 'asc' ? a.num - b.num : b.num - a.num));

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
            console.error('Move error', e);
          }
        }
      }
      return { ok: true };
    })();
  }

  if (msg.action === 'focusTab') {
    focusTab(msg.tabId, msg.windowId);
  }

  if (msg.action === 'moveTabs') {
    // msg.windowId, msg.tabIds, msg.startIndex
    moveTabsInWindow(msg.windowId, msg.tabIds, msg.startIndex);
  }
});
