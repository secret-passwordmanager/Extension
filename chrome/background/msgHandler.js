'use strict';

/**
 * Description. This is where we handle any messages that
 * are sent from popup.js. Each case in the switch statement
 * handles a specific type of event. After performing the 
 * necessary actions for an event, we send a response object
 * that has these variables as required: 
 * @param {bool} error True if an error occured, false if not
 * @param {string} msg A sentence describing what happened
 */

function msgHandler(request, sender, sendResponse) {
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
};