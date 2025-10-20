// popup.js
const queryInput = document.getElementById('query');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsDiv = document.getElementById('results');
const sortAscBtn = document.getElementById('sortAsc');
const sortDescBtn = document.getElementById('sortDesc');

function getMode() {
  const radios = document.getElementsByName('mode');
  for (const r of radios) if (r.checked) return r.value;
  return 'or';
}

function renderResults(list) {
  resultsDiv.innerHTML = '';
  if (!list || list.length === 0) {
    resultsDiv.innerHTML = '<div style="color:#666">No matching tabs</div>';
    return;
  }

  list.forEach(t => {
    const row = document.createElement('div');
    row.className = 'tabRow';

    const info = document.createElement('div');
    info.className = 'tabInfo';
    const title = document.createElement('div');
    title.textContent = t.title || '(no title)';
    const small = document.createElement('small');
    small.textContent = t.url;
    info.appendChild(title);
    info.appendChild(small);

    const actions = document.createElement('div');

    const focusBtn = document.createElement('button');
    focusBtn.className = 'actionBtn';
    focusBtn.textContent = 'Focus';
    focusBtn.addEventListener('click', () => {
      browser.runtime.sendMessage({ action: 'focusTab', tabId: t.id, windowId: t.windowId });
    });

    const moveBtn = document.createElement('button');
    moveBtn.className = 'actionBtn';
    moveBtn.textContent = 'Move here';
    moveBtn.title = 'Move this tab to first position in its window';
    moveBtn.addEventListener('click', async () => {
      // move this single tab to start (index 0) in its window
      await browser.runtime.sendMessage({ action: 'moveTabs', windowId: t.windowId, tabIds: [t.id], startIndex: 0 });
    });

    actions.appendChild(focusBtn);
    actions.appendChild(moveBtn);

    row.appendChild(info);
    row.appendChild(actions);
    resultsDiv.appendChild(row);
  });
}

searchBtn.addEventListener('click', async () => {
  const query = queryInput.value.trim();
  if (!query) {
    resultsDiv.innerHTML = '<div style="color:#a00">Enter a search query first</div>';
    return;
  }
  const mode = getMode();
  resultsDiv.innerHTML = '<div style="color:#666">Searching…</div>';
  try {
    const resp = await browser.runtime.sendMessage({ action: 'search', query, mode });
    const results = resp && resp.results ? resp.results : [];
    renderResults(results);
  } catch (err) {
    resultsDiv.innerHTML = `<div style="color:#a00">Search error: ${err.message}</div>`;
  }
});

clearBtn.addEventListener('click', () => {
  queryInput.value = '';
  resultsDiv.innerHTML = '';
});

// 
function showMessage(msg, color = "#4CAF50") {
  const m = document.createElement("div");
  m.textContent = msg;
  m.style.position = "fixed";
  m.style.bottom = "12px";
  m.style.left = "50%";
  m.style.transform = "translateX(-50%)";
  m.style.background = color;
  m.style.color = "white";
  m.style.padding = "8px 14px";
  m.style.borderRadius = "6px";
  m.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  m.style.opacity = "1";
  m.style.transition = "opacity 1.5s ease";
  document.body.appendChild(m);

  // Fade away
  setTimeout(() => {
    m.style.opacity = "0";
    setTimeout(() => m.remove(), 1500);
  }, 1000);
}

sortAscBtn.addEventListener('click', async () => {
  await browser.runtime.sendMessage({ action: 'sort', order: 'asc' });
  showMessage("✅ All tabs sorted (Ascending)");
});

sortDescBtn.addEventListener('click', async () => {
  await browser.runtime.sendMessage({ action: 'sort', order: 'desc' });
  showMessage("✅ All tabs sorted (Descending)");
});
