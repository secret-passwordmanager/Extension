'use strict';

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

   let settingsBtn = document.getElementById('btnSettings');
   let logoutBtn = document.getElementById('btnLogout');
   let homeBtn = document.getElementById('btnHome');

   switch (viewName) {
      case 'login':
         login.style.display = 'block';
         main.style.display = 'none';
         settings.style.display = 'none';
         logoutBtn.style.display = 'none';
         settingsBtn.style.display = 'block';
         homeBtn.style.display = 'none';
         break;
      case 'main':
         login.style.display = 'none';
         main.style.display = 'block';
         settings.style.display = 'none';
         logoutBtn.style.display = 'block';
         settingsBtn.style.display = 'block';
         homeBtn.style.display = 'none';
         break;
      case 'settings':
         login.style.display = 'none';
         main.style.display = 'none';
         settings.style.display = 'block';
         logoutBtn.style.display = 'block';
         settingsBtn.style.display = 'none';
         homeBtn.style.display = 'block';
         break;   
      default:
         return new Error('Invalid value was specified for viewName param');     
   }
}

function autoLogin() {
   let loginStatusMsg = {
      type: 'loginAuto'
   }
   chrome.runtime.sendMessage(loginStatusMsg, (res) => {
      if (res.isLoggedIn) {
         switchView('main');

      }
   });
}

function login(username, password) {

   if (typeof username != 'string') {
      throw new Error('Username must be a string');
   }
   if (typeof password != 'string') {
      throw new Error('Password must be a string');
   }

   let loginMsg = {
      type: 'login',
      username: username,
      password: password
   }

   chrome.runtime.sendMessage(loginMsg);
}

function logout() {
   let logoutMsg = {
      type: 'logout'
   }
   console.log('running');
   chrome.runtime.sendMessage(logoutMsg);
}

function getSwaps() {
   let getSwapMsg = {
      type: 'getSwaps'
   }
   chrome.runtime.sendMessage(getSwapMsg, (res) => {

      let swaps = res;

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

         case 'authLogoutSuccess':
            switchView('login');
            console.log('logged out');
            break;
         
         case 'authJwtRefreshFail':
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

autoLogin()
getSwaps();


document.getElementById('loginBtn').addEventListener(
   'click', () => {
      login(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);
   }
)

document.getElementById('btnLogout').addEventListener('click', logout);

document.getElementById('btnSettings').addEventListener('click', () => {
   switchView('settings');
});

document.getElementById('btnHome').addEventListener('click', () => {
   switchView('main');
})