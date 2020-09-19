var clickedEl = null;

document.addEventListener('contextmenu', (events) => {
   clickedEl  = event.target;
});

chrome.runtime.onMessage.addListener((req,sender, sendResp) => {
   switch(req.event) {
      case 'contextMenuSwapReady':
         clickedEl.value = req.opts.token;
         break;
   }
});