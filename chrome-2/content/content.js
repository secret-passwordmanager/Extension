var clickedEl = null;

document.addEventListener('contextmenu', (events) => {
   clickedEl  = event.target;
});

chrome.runtime.onMessage.addListener((req,sender, sendResp) => {
   console.log(req);
   clickedEl.value = req.val;
   console.log(clickedEl.value)

   sendResp({farewell:'bfd'})
});