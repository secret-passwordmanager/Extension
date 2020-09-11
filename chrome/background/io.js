'use strict';

var socket = null;

var ioUntrusted = {

   connect: () => {
      chrome.storage.local.get(['jwt'], (storage) => {
         console.log(storage);
         console.log(services.swap.url);
         if (typeof storage.jwt != 'string') {
            return new Error('Cannot connect without a jwt');
         }

         socket = io.connect(services.swap.url, {
            query: storage
         });
      });



   },
   emit: {

      /**
       * Description. This function will tell
       * our 
       */
      swapNew: (swap) => {

         if (typeof swap.domain != 'string') {
            throw new Error('swap.domain must be a string');
         }
         if (typeof swap.token != 'string') {
            throw new Error('swap.token must be a string');
         }
         if (typeof swap.authId != 'string') {
            throw new Error('swap.authId must be a string')
         }
         if (typeof swap.credType != 'string') {
            throw new Error('swap.credType must be a string');
         }
         if (socket == null) {
            return new Error('Connection to swap service has not been made');
         }

         socket.emit('swapNew', swap);
      }


   }

}