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

function logIn(username, password) {

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

   chrome.runtime.sendMessage(loginMsg, (resp) => {
     
   });
}

function autoLogin() {
   let loginStatusMsg = {
      type: 'autoLogin'
   }
   chrome.runtime.sendMessage(loginStatusMsg, (resp) => {

      // /* If resp.val is true, user is already logged in */
      // if (resp.isLoggedIn) {
      //    switchView('main');
      // } else {
      //    switchView('login');
      // }

   })
}
//////////////////////////////////////////////
////////////////// Runtime ///////////////////
//////////////////////////////////////////////
chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      switch(request.msg) {
         case 'loginFail':
            console.log('cant log in');
            break;
         
         case 'loginSuccess':
            switchView('main');
            break;
         
         case 'autoLogin':
            console.log('autologin');
            switchView('main');
            break;

         default:
            console.log('invalid message');
            break;   
      }
   }
);

autoLogin();

/* See if user is already logged in. Add event listener to login button */
//autoLogin();
document.getElementById('loginBtn').addEventListener(
   'click', () => {
      logIn(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);

   }
)

