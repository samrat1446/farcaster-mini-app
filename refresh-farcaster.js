// Auto-refresh Farcaster manifest page
console.log("Refreshing Farcaster manifest page...");

// Wait for page to load
setTimeout(() => {
  // Click refresh button if exists
  const refreshBtn = document.querySelector('button[class*="refresh"], button:contains("Refresh")');
  if (refreshBtn) {
    refreshBtn.click();
    console.log("Refresh button clicked!");
  }
  
  // Try to fetch the domain again
  setTimeout(() => {
    const fetchBtn = document.querySelector('button[class*="fetch"], button:contains("Fetch")');
    if (fetchBtn) {
      fetchBtn.click();
      console.log("Fetch button clicked!");
    }
  }, 2000);
}, 1000);