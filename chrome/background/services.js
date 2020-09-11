'use strict';

/**
 * Description. @services holds functions that
 * make external calls to our api
 */
var services = {};
services.auth = {
   url: 'http://localhost:8080/auth',

   /**
    * Description. Makes a request to Secret's auth server
    * and stores the refreshToken from the response in the
    * browser 
    * @param {string} username user's username
    * @param {string} password user's password
    * @return {undefined} Returns void
    */
   login: async (username, password) => {
      return fetch(services.auth.url + '/login', {

         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({
            username: username,
            password: password
         })
      })
      .then((resp) => {
         if (resp.ok) {
            return resp.json().then(body => {
               if (typeof body.refreshToken != 'string') {
                  return new Error('Could not log in. Invalid username or password maybe idk');
               }
               chrome.storage.local.set({'refreshToken': body.refreshToken});
            });
         } else {
            console.log('in resp.error')
            return new Error('Could not log in. Invalid username or password maybe idk');
         }
      });
   },

   /**
    * Grab and store a new JWT using the refreshToken
    */
   refresh: () => {
      chrome.storage.local.get(['refreshToken'], (item) => {
         fetch(services.auth.url + '/refresh', {
            method: 'POST',
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify({
               refreshToken: item.refreshToken
            })
         })
         .then((resp) => {
            if (resp.ok) {
               resp.json().then(body => {
                  chrome.storage.local.set(body);
               })
            }
         });
      });
   }
};

services.swap = {
   url: 'http://192.168.100.245:8080/Untrusted'
}