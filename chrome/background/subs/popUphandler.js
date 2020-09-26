
/**
 * Description. This class handles
 * communicating with the popUp. It adopts 
 * the singleton and observer design
 * patterns. It is a subscriber
 * 
 * @designPattern observer-subscriber
 */
class PopUpHandler extends Subscriber {

   #auth = false;
   #swaps = [];

   constructor() {
      /* Singleton design pattern */
      if (PopUpHandler._instance) {
         return PopUpHandler._instance;
      }
      super();
      PopUpHandler._instance = this;

      /* Subscribe this object to events */
      new AuthHandler().subscribe(this);
      new IoHandler().subscribe(this);

      /* Start listening for events from popup.js */
      this.#enableMessageListener();
   }
   
   update(event, opts) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      /* Pass the message to popup.js */
      chrome.runtime.sendMessage({
         event: event,
         opts: opts
      });

      switch(event) {

         case 'authLoginSuccess':
            this.#auth = true;
            break;
         
         case 'authLoginFail':
            this.#auth = false;
            break;
         
         case 'authLogoutSuccess':
            this.#auth = false;
            break;

         case 'ioNewTrustedConn':
            break;

         case 'ioSwapApproved':
            this.#swaps.splice(this.#swaps.indexOf(opts), 1);
            break;

         case 'ioSwapDenied':
            this.#swaps.splice(this.#swaps.indexOf(opts), 1);
            break;

         case 'ioSwapSubmitted':
            this.#swaps.push(opts);
            break;
              
      }
   }

   #enableMessageListener() {

      chrome.runtime.onMessage.addListener(
         (request, sender, sendResponse) => {
            if (typeof request.type != 'string') {
               sendResponse({Error: 'message must be object with param \'type\''});
            }
            let authHandler = new AuthHandler();
            switch(request.type) {
         
               /**
                * Description. If the user wants to change their ip
                */
               case 'editIp':
                  services.baseUrl = request.ip;
                  break;
               /**
                * Description. popup.js will emit this event when a user clicks the 
                * login button.
                */
               case 'login':
                  authHandler.login(request.username, request.password);
                  sendResponse({
                     error: false, 
                     msg:'received loginMsg'
                  });
                  break;
         
               /**
                * Description. popup.js will emit this event to try and login
                * automatically 
                */
               case 'loginAuto':
                  sendResponse({
                     isLoggedIn: this.#auth, 
                     msg:'received autoLoginMsg'
                  });
                  break;

               case 'getSwaps':
                  sendResponse(this.#swaps);
                  break;

               case 'logout':
                  authHandler.logout();
                  sendResponse({
                     isLoggedIn: this.#auth, 
                     msg:'received logoutMsg'
                  });
                  break;

               /**
                * Description. If the type did match any of the previous cases,
                * just return a response with error set to true and an 
                * appropriate msg
                */
               default:
                  sendResponse({
                     error: true,
                     msg: 'Invalid type'
                  });
               
                  break;
            }
            return true;
         });


   }


}