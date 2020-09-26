'use strict';

//////////////////////////////////////////////
/////////// Authorization Functions //////////
//////////////////////////////////////////////

/**
 * Checks if the user is already logged in. If
 * they are, it will take them to the home page,
 * if they are not, it will take them to the login
 * page
 */
function autoLogin() {
   let loginStatusMsg = {
      type: 'loginAuto'
   }
   chrome.runtime.sendMessage(loginStatusMsg, (res) => {
      if (res.isLoggedIn) {
         console.log('logged in');
         switchView('home');
      } else {
         console.log('not logged in');
         switchView('login');
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


function switchView(viewName) {

   if (typeof viewName != 'string') {
      throw new Error('viewName param must be either login, settings, or main');
   }

   let login = document.getElementById('loginView');
   let home = document.getElementById('homeView');
   let settings = document.getElementById('settingsView');

   let settingsBtn = document.getElementById('btnSettings');
   let logoutBtn = document.getElementById('btnLogout');
   let homeBtn = document.getElementById('btnHome');

   switch (viewName) {
      case 'login':
         login.style.display = 'block';
         home.style.display = 'none';
         settings.style.display = 'none';
         logoutBtn.style.display = 'none';
         settingsBtn.style.display = 'block';
         homeBtn.style.display = 'none';
         break;
      case 'home':
         login.style.display = 'none';
         home.style.display = 'block';
         settings.style.display = 'none';
         logoutBtn.style.display = 'block';
         settingsBtn.style.display = 'block';
         homeBtn.style.display = 'none';
         break;
      case 'settings':
         login.style.display = 'none';
         home.style.display = 'none';
         settings.style.display = 'block';
         logoutBtn.style.display = 'block';
         settingsBtn.style.display = 'none';
         homeBtn.style.display = 'block';
         break;   
      default:
         return new Error('Invalid value was specified for viewName param');     
   }
}

function editIp(newIp) {

   chrome.runtime.sendMessage({
      type: 'editIp',
      ip: newIp
   });
}

function getSwaps() {
   let getSwapMsg = {
      type: 'getSwaps'
   }
   chrome.runtime.sendMessage(getSwapMsg, (swaps) => {

      /* If there are no swaps, change the title */
      if (swaps.length == 0) {
         document.getElementById('swapsTitle').textContent = 'No Pending Swaps';
      }

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


