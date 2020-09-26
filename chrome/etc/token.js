
/**
 * Description. @tokenGenerator can generate random
 * passwords, creditcards, emails, and usernames. 
 */
var genToken = {

   /**
    * Description. Returns a password that contains
    * at least 1 number, 1 upper case, 1 lower case,
    * and 1 special char
    * @return {string} returns the generated password
    */
   password: (len) => { //TODO: Make less extra
      var length = (len) ? (len) : (10);
      var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
      var numeric = '0123456789';
      var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
      var password = "";
      var character = "";
      while (password.length < length) {
         entity1 = Math.ceil(string.length * Math.random() * Math.random());
         entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
         entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
         hold = string.charAt(entity1);
         hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
         character += hold;
         character += numeric.charAt(entity2);
         character += punctuation.charAt(entity3);
         password = character;
      }
      password = password.split('').sort(function () { return 0.5 - Math.random() }).join('');
      return password.substr(0, len);
   },
   
   creditCard: () => {
      return 'TODO';
   },

   /**
    * Description. Returns a valid username that consists of an 8
    * character word.
    * @return {string} returns the generated username
    */
   username: () => {
      let length = 8,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
         retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
   },

   /**
    * Description. Generates a valid email that has a random username,
    * a random domain, and '.com' at the end
    * @return {string} returns the generated email
    */
   email: () => {
      var strValues = "abcdefg12345";
      var strEmail = "";
      var strTmp;
      for (var i = 0; i < 10; i++) {
         strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
         strEmail = strEmail + strTmp;
      }
      strTmp = "";
      strEmail = strEmail + "@";
      for (var j = 0; j < 8; j++) {
         strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
         strEmail = strEmail + strTmp;
      }
      strEmail = strEmail + ".com"
      return strEmail;
   }
};
