'use strict';

var socket = null;

var ioUntrusted = {

   connect: () => {
      socket = io.connect(services.proxy.url);

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