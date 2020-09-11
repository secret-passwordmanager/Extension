/**
 * Description. This class handles login.
 * It adopts the singleton and observer 
 * design patterns. It is a publisher, so
 * it can emit certain events. Currently,
 * its subscribers listen for:
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
   }

   login() {
      super.notify('loginSuccess');
   }

}
