/**
 * Description. This file contains the code
 * for the base class that all publishers
 * will inherit from. 
 */

class Publisher {

   /**
    * Description. A map that holds all of the 
    * subscribers for all valid events
    * @key {string} A string that is a valid event
    * for this publisher
    * @values {array} Returns an array of all objects
    * subscribed to this event
    */
   #subscribers;

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
      /* Initialize subscribers */
      this.#subscribers = new Map();
      
      /* Set up subscribers */
      events.forEach(event => {
         if (typeof event != 'string') {
            throw new Error('Each value in events array must be a string');
         }
         if (typeof this.#subscribers.get(event) != 'undefined') {
            throw new Error('Duplicate event in events array found. Check your input');
         }
         this.#subscribers.set(event, []);
      });
   }

   /**
    * Description. Notifies all subscribers that a 
    * certain event occurer
    * @param {string} event
    * @return {undefined} Returns nothing on success
    * @return {Error} Returns an error if the event does not exist 
    */
   notify(event) {
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      /* Grab the current subs to this event. */
      let eventSubs = this.#subscribers.get(event);
      console.log(eventSubs);
      if (!Array.isArray(eventSubs)) {
         return new Error('This publisher does not have this event');
      }

      eventSubs.forEach((sub) => {
         sub.update(event);
      });
   }

   /**
    * Description. Allows instances of the subscriber
    * class to subscribe to an event that the publisher
    * has
    * @param {Subscriber} subscriber 
    * @param {string} event 
    * @return {undefined} On success
    * @return {Error} On errors
    */
   subscribe(subscriber, event) {
      if (!(subscriber instanceof Subscriber)) {
         throw new Error('subscriber must be derived from Subscriber class');
      }
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }


      /* Grab the current subs to this event. */
      let eventSubs = this.#subscribers.get(event);
      if (!Array.isArray(eventSubs)) {
         return new Error('This publisher does not have this event');
      }
      /* Add the subscriber and update the map */
      eventSubs.push(subscriber);
      this.#subscribers.set(event, eventSubs);
   }

   /**
    * Description. Allows instances of the subscriber
    * class to unsubscribe to an event that they had
    * previously subscribed to
    * @param {Subscriber} subscriber 
    * @param {string} event 
    * @return {undefined} On success
    * @return {Error} On errors
    */
   unsubscribe(subscriber, event) {
      if (!(subscriber instanceof Subscriber)) {
         throw new Error('subscriber must be derived from Subscriber class');
      }
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      /* Grab the current subs to this event. */
      let eventSubs = this.#subscribers.get(event);
      if (!Array.isArray(eventSubs)) {
         return new Error('This publisher does not have this event');
      }

      let index = eventSubs.indexOf(subscriber);
      if (index == -1) {
         return new Error('This subscriber could not be found');
      }
      /* Delete and update the array */
      eventSubs.splice(index, 1);
      console.log(eventSubs);
      this.#subscribers.set(event, eventSubs);
   }
}