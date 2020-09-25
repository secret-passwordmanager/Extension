'use strict';
/* 
let swaps = [];
swaps.push({
   domain: 'google.com',
   token: 'fdanjvda',
   type: 'password',
   authId: 'Ab2C'
}) */
//////////////////////////////////////////////
//////////// Function Declarations ///////////
//////////////////////////////////////////////

function switchView(viewName) {

   if (typeof viewName != 'string') {
      throw new Error('viewName param must be either login, settings, or main');
   }

   let login = document.getElementById('loginView');
   let main = document.getElementById('mainView');
   let settings = document.getElementById('settingsView');

   switch (viewName) {
      case 'login':
         login.style.display = 'block';
         main.style.display = 'none';
         settings.style.display = 'none';
         break;
      case 'main':
         login.style.display = 'none';
         main.style.display = 'block';
         settings.style.display = 'none';
         break;
      case 'settings':
         login.style.display = 'none';
         main.style.display = 'none';
         settings.style.display = 'block';
         break;   
      default:
         return new Error('Invalid value was specified for viewName param');     
   }
}

function auth(username, password) {

   if (typeof username != 'string') {
      throw new Error('Username must be a string');
   }
   if (typeof password != 'string') {
      throw new Error('Password must be a string');
   }

   let loginMsg = {
      type: 'auth',
      username: username,
      password: password
   }

   chrome.runtime.sendMessage(loginMsg);
}

function AutoAuth() {
   let loginStatusMsg = {
      type: 'autoAuth'
   }
   chrome.runtime.sendMessage(loginStatusMsg, (res) => {
      if (res.isLoggedIn) {
         switchView('main');

      }
   });
}

function getSwaps() {
   let getSwapMsg = {
      type: 'getSwaps'
   }
   chrome.runtime.sendMessage(getSwapMsg, (res) => {

      let swaps = [];
/* swaps.push({
   domain: 'google.com',
   token: 'fdanjvda',
   type: 'password',
   authId: 'Ab2C'
}); */
      swaps = res;
      console.log(swaps);
      console.log(res);
      swaps.forEach(swap => {

         let swapWrapper = document.createElement('div');
         swapWrapper.classList.add('swapWrapper');

         let subWrapper = document.createElement('div');
         subWrapper.classList.add('swapSubWrapper');

         let divDomain = document.createElement('div');
         divDomain.innerHTML = '<h3>' + swap.domain +'</h3>';
         divDomain.classList.add('swapDomain');
         subWrapper.appendChild(divDomain);

         let divType = document.createElement('div');
         divType.innerHTML = '<h3>' + swap.type +'</h3>';
         divType.classList.add('swapType');
         subWrapper.appendChild(divType);

         swapWrapper.appendChild(subWrapper);

         let divAuthId = document.createElement('div');
         divAuthId.innerHTML = '<h2>' + swap.authId +'</h2>';
         divAuthId.classList.add('swapAuthId');
         swapWrapper.appendChild(divAuthId);


         document.getElementById('swaps').appendChild(swapWrapper);

      });
   });
}


//////////////////////////////////////////////
////////////////// Runtime ///////////////////
//////////////////////////////////////////////


chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      switch(request.event) {
         case 'authLoginFail':
            console.log('Cannot authorize. Probably invalid credentials');
            break;
         
         case 'authLoginSuccess':
            switchView('main');
            break;

         case 'authJwtRefreshFail':
            console.log('ohh herere')
            switchView('login');
            break;

         case 'ioSwapApproved':
            swaps.splice(swaps.indexOf(request.opts), 1);
            break;

         case 'ioSwapDenied':
            swaps.splice(swaps.indexOf(request.opts), 1);
            break;

         case 'ioSwapSubmitted':
            swaps.push(opts);
            break;
                 
      }
   }
);
switchView('login');

AutoAuth()
console.log('yo')
getSwaps();


document.getElementById('loginBtn').addEventListener(
   'click', () => {
      auth(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);
   }
)

