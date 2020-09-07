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
      if (!resp.error) {
         switchView('main');
      }
      else {
         console.log(resp);
      }
   });
}

function autoLogin() {
   let loginStatusMsg = {
      type: 'loginStatus'
   }
   chrome.runtime.sendMessage(loginStatusMsg, (resp) => {
      console.log(resp)
      if (resp.error) {
         console.log('herere' + resp);
         return;
      }
      /* If resp.val is true, user is already logged in */
      if (resp.val) {
         switchView('main');
      } else {
         switchView('login');
      }

   })
}



//////////////////////////////////////////////
////////////////// Runtime ///////////////////
//////////////////////////////////////////////
var ids = {

}
console.log('hbh')
autoLogin();

document.getElementById('loginBtn').addEventListener(
   'click', () => {
      logIn(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);

   }
)