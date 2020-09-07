'use strict';
//////////////////////////////////////////////
////////////// Global Variabls ///////////////
//////////////////////////////////////////////

/**
 * Description. @services holds functions that
 * make external calls to our microservices
 */
var services = {};

services.auth = {
   url: 'http://localhost:8080/auth/',

   /**
    * Description. Makes a request to Secret's auth server
    * and stores the refreshToken from the response in the
    * browser 
    * @param {*} username user's username
    * @param {*} password user's password
    * @return {undefined} Returns void
    */
   login: (username, password) => {
      fetch(services.auth.url + 'login', {

         method: 'post',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({
            'username': username,
            'password': password
         })
      })
      .then((resp) => {
         if (resp.ok) {
            return resp.json().then(body => {
               if (typeof body.refreshToken != 'string') {
                  return new Error('Could not log in. Invalid username or password maybe idk');
               }
               chrome.storage.local.set({'refreshToken': body.refreshToken});
               chrome.storage.local.get(['refreshToken'], (items) => {
                  //console.log(items);
               });
            });
         } else {
            return new Error('Could not log in. Invalid username or password maybe idk');
         }
      });
   },

   refresh: () => {


   }
};
//////////////////////////////////////////////
////////////// Helper Functions //////////////
//////////////////////////////////////////////
/**
 * Description. Call this function to check
 * if the user is logged in
 * @return {boolean} true if logged in, else
 * false
 */
async function  isLoggedIn() {

   return await chrome.storage.local.get(['refreshToken'], (tok) => {
      if (typeof tok != undefined) {
         console.log(tok);
         return true;
      } 
      return false;
   });

}


//////////////////////////////////////////////
////////////// Message Handler ///////////////
//////////////////////////////////////////////

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
            try {
               let login = services.auth.login(request.username, request.password);
               if (login instanceof Error) {
                  throw login;
               }
               sendResponse({
                  error: false, 
                  msg:'successfully grabbed refresh token from auth server',
                  val: null
               });
            
            }
            catch(err) {
               sendResponse({
                  error: true,
                  msg: err.message,
                  val: null
               });
            }

         /**
          * Description. popup.js will emit this event to 
          */
         case 'loginStatus':
            /* Check if user is already logged in */
            if (isLoggedIn()) {
               console.log('here');
               sendResponse({
                  error: false,
                  msg: 'User was already logged in',
                  val: true
               });
               return;
            } else {
               sendResponse({
                  error: false,
                  msg: 'No refresh token found in storage',
                  val: false
               });
            }

            
         default:
            sendResponse({Error: 'unknown type param value'});
      }
   }
)