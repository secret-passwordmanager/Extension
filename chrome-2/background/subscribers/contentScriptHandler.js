
/**
 * Description. This class handles
 * messaging the popUp. It adopts 
 * the singleton and observer design
 * patterns. It is a subscriber
 * @designPattern observer-subscriber
 * @subscriptions [loginSuccess, loginFail]
 */
class ContentScriptHandler extends Subscriber {

   constructor() {

      /* Singleton design pattern */
      if (ContentScriptHandler._instance) {
         return ContentScriptHandler._instance;
      }
      super();

      /* Subscribe this object to events */
      let loginHandler = new LoginHandler();
      loginHandler.subscribe(this, 'loginSuccess');
      loginHandler.subscribe(this, 'loginFail');



      ContentScriptHandler._instance = this;
   }
   
   update(event) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      switch (event) {
         case 'loginSuccess':
            console.log('loginSuccess from contentScriptHandler');
            this.#enableContextMenu();
            break;

         case 'loginFail': 
            console.log('not working');
            break;
      }
   }

   #enableContextMenu() {
      const credTypes = {
         password: '0',
         creditCard: '1',
         username: '2',
         email: '3'
      }
      
      chrome.contextMenus.create({
         id: credTypes.password,
         title: "Password",
         visible: true,
         contexts: ["editable"]
      });
      // chrome.contextMenus.create({
      //    id: credTypes.creditCard,
      //    title: 'Credit Card',
      //    visible: true,
      //    contexts: ["editable"]
      // });
      chrome.contextMenus.create({
         id: credTypes.username,
         title: 'Username',
         visible: true,
         contexts: ["editable"]
      });
      chrome.contextMenus.create({
         id: credTypes.email,
         title: 'Email',
         visible: true,
         contexts: ["editable"]
      });
   
      chrome.contextMenus.onClicked.addListener(async (info, tab) => {
   
         let value = null;
         switch (info.menuItemId) {
            case credTypes.password:
               value = genToken.password();
               break;
            case credTypes.username:
               value = genToken.username();
               break;
            case credTypes.email:
               value = genToken.email();
               break;
            default:
               console.log('Invalid menuItemId. Aborting. . .');
               return;
         }
         try {
            let conn = ioUntrusted.connect();
            console.log('gerererv');
            console.log(conn);
            if (conn instanceof Error) {
               throw conn;
            }
         } catch(err) {
            console.log(err.message);
         }
   
   
   
         
         chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tab.id, {val: value}, (resp) => {
               console.log(resp);
            })
         })
   
      })
   
   

   }






}