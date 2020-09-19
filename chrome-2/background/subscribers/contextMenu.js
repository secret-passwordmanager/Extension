
/**
 * Description. This class handles everything
 * related to the context menu (the menu
 * that appears when you right click on a 
 * text field)
 * @designPattern pub-sub
 * @subscriptions [loginSuccess, loginFail]
 */
class ContextMenu extends Subscriber {

   constructor() {
      /* Singleton design pattern */
      if (ContextMenu._instance) {
         return ContextMenu._instance;
      }
      super();
      ContextMenu._instance = this;

      /* Subscribe this object to events */
      let login = new LoginHandler();
      login.subscribe(this);
   }
   
   update(event) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      switch (event) {
         case 'loginSuccess':
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