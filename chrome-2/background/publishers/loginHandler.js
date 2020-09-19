/**
 * Description. This class handles login.
 * It adopts the singleton and observer 
 * design patterns. It is a publisher, so
 * it can notify its subscribers of the 
 * following events:
 * @events [loginSuccess, loginFail]
 */
class LoginHandler extends Publisher {

   constructor() {
      /* Singleton design pattern */
      if (LoginHandler._instance) {
         return LoginHandler._instance;
      }
      super(['loginSuccess', 'loginFail']);
      LoginHandler._instance = this;
      
      /* Try to auto login */
      this.autoLogin();
   }

   /**
    * Description. If the user has a refreshToken in
    * storage, will notify of an autoLogin event
    */
   autoLogin() {
      chrome.storage.local.get(['refreshToken'], (res) => {
         if (res.refreshToken) {
            super.notify('loginSuccess');
         }
      });
   }

   /**
    * Description. Attempts to log the user in
    * @param {string} username 
    * @param {string} password 
    */
   login(username, password) {
      services.auth.login(username, password).then((login) => {
         if (login instanceof Error) {
            super.notify('loginFail');
            throw login;
         } else {
            super.notify('loginSuccess');
         }
      });
   }
}
