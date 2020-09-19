
/**
 * Description. This class handles
 * communicating with the popUp. It adopts 
 * the singleton and observer design
 * patterns. It is a subscriber
 * 
 * @designPattern observer-subscriber
 * @subscriptions [loginSuccess, loginFail]
 */
class PopUpHandler extends Subscriber {

   constructor() {
      /* Singleton design pattern */
      if (PopUpHandler._instance) {
         return PopUpHandler._instance;
      }
      super();
      PopUpHandler._instance = this;

      /* Subscribe this object to events */
      let login = new LoginHandler();
      login.subscribe(this);

      /* Start listening for events from popup.js */
      this.#enableMessageListener();
   }
   
   update(event) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      switch (event) {
         case 'loginSuccess':
            chrome.runtime.sendMessage({
               msg: "loginSuccess",
            });
            break;

         case 'loginFail': 
            chrome.runtime.sendMessage({
               msg: "loginFail" 
            });
            break;
      }
   }

   #enableMessageListener() {

      chrome.runtime.onMessage.addListener(
         (request, sender, sendResponse) => {
            if (typeof request.type != 'string') {
               sendResponse({Error: 'message must be object with param \'type\''});
            }
            let loginHandler = new LoginHandler();
            switch(request.type) {
         
               /**
                * Description. popup.js will emit this event when a user clicks the 
                * login button.
                */
               case 'login':
                  loginHandler.login(request.username, request.password);
                  sendResponse({
                     error: false, 
                     msg:'received loginMsg'
                  });
                  break;
         
               /**
                * Description. popup.js will emit this event to try and login
                * automatically 
                */
               case 'autoLogin':
                  loginHandler.autoLogin();
                  sendResponse({
                     error: false, 
                     msg:'received autoLoginMsg'
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