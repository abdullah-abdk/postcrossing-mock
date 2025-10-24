function showStatus() {
  const status = document.getElementById('status');
  status.style.opacity = '1';
  setTimeout(() => {
    status.style.opacity = '0';
  }, 2000); 
}

document.getElementById('asc').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: 'sort', order: 'asc' });
  showStatus();
});

document.getElementById('desc').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: 'sort', order: 'desc' });
  showStatus();
});
