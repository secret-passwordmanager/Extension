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
      }
   }
);
switchView('login');
AutoAuth();

document.getElementById('loginBtn').addEventListener(
   'click', () => {
      auth(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);
   }
)

