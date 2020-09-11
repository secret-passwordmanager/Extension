
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

      /* Subscribe this object to events */
      let loginHandler = new LoginHandler();
      loginHandler.subscribe(this, 'loginSuccess');
      loginHandler.subscribe(this, 'loginFail');
      this.#enableMessageListener();


      PopUpHandler._instance = this;
   }
   
   update(event) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      switch (event) {
         case 'loginSuccess':
            console.log('working');
            break;

         case 'loginFail': 
            console.log('not working');
            break;
      }
   }

   #enableMessageListener() {

      chrome.runtime.onMessage.addListener(
         (request, sender, sendResponse) => {
            if (typeof request.type != 'string') {
               sendResponse({Error: 'message must be object with param \'type\''});
            }
         
            switch(request.type) {
         
               /**
                * Description. popup.js will emit this event when a user clicks the 
                * login button.
                * @param {object} loginMsg message that contains parameters @type , @username ,
                * and @password
                */
               case 'login':
                  services.auth.login(request.username, request.password).then((login) => {
                     if (login instanceof Error) {
                        console.log('hbhere')
                        throw login;
                     } 
         
                     /* Refresh to get jwt every 4.5 minutes */
                     services.auth.refresh();
                     setInterval(() => {
                        services.auth.refresh();
                     }, 250000);
                     console.log('success')
         
                     sendResponse({
                        error: false, 
                        msg:'successfully grabbed refresh token from auth server'
                     });
                  })
                  .catch((err) => {
                     sendResponse({
                        error: true,
                        msg: err.message
                     });
                  });
                  break;
         
               /**
                * Description. popup.js will emit this event to check if the user 
                * is already loggied in. I.e. If a refreshToken exists in storage
                */
               case 'loginStatus':
                  chrome.storage.local.get(['jwt'], (items) => {
                     
                     /* Check if user is already logged in */
                     if (items.jwt != undefined) {
                        sendResponse({
                           error: false,
                           msg: 'User was already logged in',
                           isLoggedIn: true
                        });
                     } else {
                        sendResponse({
                           error: false,
                           msg: 'No refresh token found in storage',
                           isLoggedIn: false
                        });
                     }
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