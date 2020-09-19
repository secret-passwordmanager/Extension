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
   login: (username, password) => {
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
            return resp.json().then((body) => {
               return body.refreshToken;
            });
         }
      });
   },

   /**
    * Grab and store a new JWT using the refreshToken
    */
   refresh: (refreshToken) => {     
      return fetch(services.auth.url + '/refresh', {
         method: 'POST',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({
            refreshToken: refreshToken
         })
      })
      .then((resp) => {
         if (resp.ok) {
            return resp.json();
         }
      })
   }
};

services.swap = {
   url: 'http://localhost:8080/Untrusted'
}