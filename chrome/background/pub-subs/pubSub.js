/**
 * Description. This file contains the code
 * for the base class that all publishers
 * will inherit from. 
 */

class PubSub {

   /** TODO: probably dont need subscribers to be key-value, but just 1-D array. hopefully u remember what u meant
    * Description. A map that holds all of the 
    * subscribers for all valid events
    * @key {string} A string that is a valid event
    * for this publisher
    * @values {array} Returns an array of all objects
    * subscribed to this event
    */
   #subscribers = [];
   #events;
   /**
    * Description. Creates a publisher that can notify
    * any objects that have subscribed to it that certain
    * events have occured
    * @param {Array} events An array of strings, with each
    * string being a certain event  
    */
   constructor(events) {
      /* Make sure events is an array */
      if (!Array.isArray(events)) {
         throw new Error('events must be an array of all valid events');
      }

      /* Make sure events is an array of strings */
      events.forEach(event => {
         if (typeof event != 'string') {
            throw new Error('Each value in events array must be a string');
         }
      });

      /* Copy events to be in #events set */
      this.#events = new Set(events);
   }

   /**
    * Description. Notifies all subscribers that a 
    * certain event occurer
    * @param {string} event
    * @return {undefined} Returns nothing on success
    * @return {Error} Returns an error if the event does not exist 
    */
   notify(event, opts) {
      /* Run pre checks */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }
      if (!this.#events.has(event)){
         throw new Error('This publisher does not have this event');
      }

      /* Update all subscribers */
      this.#subscribers.forEach((sub) => {
         sub.update(event, opts);
      });
   }

   /**
    * Description. Allows instances of the subscriber
    * class to subscribe to this publisher
    * has
    * @param {Subscriber} subscriber 
    * @return {undefined} On success
    * @return {Error} On errors
    */
   subscribe(subscriber) {
      if (!(subscriber instanceof Subscriber) && !(subscriber instanceof PubSub)) {
         throw new Error('subscriber must be derived from Subscriber class');
      } 
      if (this.#subscribers.indexOf(subscriber) != -1) {
         console.log('bfadfdafdsa')
         throw new Error('This subscriber is already subscribed');
      }

      this.#subscribers.push(subscriber);
   }

   /**
    * Description. Allows instances of the subscriber
    * class to unsubscribe to this publisher
    * @param {Subscriber} subscriber 
    * @return {undefined} On success
    * @return {Error} On errors
    */
   unsubscribe(subscriber) {
      if (!(subscriber instanceof Subscriber) && !(subscriber instanceof PubSub)) {
         throw new Error('subscriber must be derived from Subscriber class');
      }
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      /* Delete this subscriber */
      subIndex = this.#subscribers.indexOf(subscriber);
      this.#subscribers.splice(subIndex, 1);
   }

   update(event, opts) {
      return new Error('Derived class has not overridden update member function');
   }
}