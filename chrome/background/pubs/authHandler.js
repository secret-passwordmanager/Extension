/**
 * Description. This class handles login.
 * It adopts the singleton and observer 
 * design patterns. It is a publisher, so
 * it can notify its subscribers of the 
 * following events:
 * @events [loginSuccess, loginFail]
 */
class AuthHandler extends Publisher {

   constructor() {
      /* Singleton design pattern */
      if (AuthHandler._instance) {
         return AuthHandler._instance;
      }
      super([
         'authLoginFail', 
         'authLoginPending',
         'authLoginSuccess',
         'authLogoutFail',
         'authLogoutSuccess',
         'authJwtRefreshSuccess',
         'authJwtRefreshFail',
      ]);
      AuthHandler._instance = this;
      
      /* Try to auto login */
      this.#autoLogin();
   }

   /**
    * Description. If the user has a refreshToken in
    * storage, will notify of an autoLogin event
    */
   #autoLogin() {
      chrome.storage.local.get(['refreshToken'], (res) => {
         if (res.refreshToken) {
            super.notify('authLoginSuccess', null);
            this.#refresh();
         }
      });
   }

   /**
    * Description. Attempts to log the user in
    * @param {string} username 
    * @param {string} password 
    */
   login(username, password) {
      super.notify('authLoginPending', null);
      services.auth.login(username, password)
      .then((refreshToken) => {         
         /* If a refreshToken was not returned */
         if (typeof refreshToken != 'string') {
            super.notify('authLoginFail', {
               msg: 'Invalid password or username'
            });
         }
         else {
            super.notify('authLoginSuccess', null);
            chrome.storage.local.set({'refreshToken': refreshToken}, (() => {
               this.#refresh();
            }));
         }
      })
      .catch((err) => {
         console.log(err.message);

         super.notify('authLoginFail', {
            msg: 'Could not reach Secret\'s auth server'
         });
      });
   }

   logout() {
      chrome.storage.local.get(['refreshToken'], (res) => {

         /* If there was no refreshToken, notify of error */
         if (typeof res.refreshToken != 'string') {
            super.notify('authLogoutFail', {
               msg: 'RefreshToken not found in storage'
            });
            return;
         } 

         /* Otherwise, delete refreshToken and notify */
         chrome.storage.local.remove(['refreshToken']);
         chrome.storage.local.remove(['jwt']);
         super.notify('authLogoutSuccess');
      });
   }


   #refresh() {
      chrome.storage.local.get(['refreshToken'], (res) => {

         if (typeof res.refreshToken != 'string') {
            super.notify('authJwtRefreshFail', {
               msg: 'RefreshToken not found in storage'
            });
         }

         services.auth.refresh(res.refreshToken)
         .then((jwt) => {

            if (typeof jwt != 'object') {
               super.notify('authJwtRefreshFail', {
                  msg: 'Invalid refresh token'
               });
            } else {
               chrome.storage.local.set(jwt);
               super.notify('authJwtRefreshSuccess', null);
            }
         })
         .catch((err) => {
            console.log(err.message);
            super.notify('authJwtRefreshFail', {
               msg: 'Could not read Secret\'s auth server'
            });
         });
      });
   }
   
}
