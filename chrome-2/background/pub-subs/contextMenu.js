/**
 * Description. This class handles everything
 * related to the context menu (the menu
 * that appears when you right click on a 
 * text field)
 * @designPattern pub-sub
 */
class ContextMenu extends PubSub {

   constructor() {
      /* Singleton design pattern */
      if (ContextMenu._instance) {
         return ContextMenu._instance;
      }
      super([
         'contextMenuSwapReady'
      ]);
      ContextMenu._instance = this;

      /* Subscribe this object to events */
      new AuthHandler().subscribe(this);
   }
   
   update(event, opts) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }

      switch (event) {
         case 'authLoginSuccess':
            this.#enableContextMenu();
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
         let token = '';
         let type = '';
         let domain = new URL(tab.url).hostname;
         switch (info.menuItemId) {
            case credTypes.password:
               token = genToken.password();
               type = 'password';
               break;
            case credTypes.username:
               token = genToken.username();
               type = 'username';
               break;
            case credTypes.email:
               token = genToken.email();
               type = 'email';
               break;
         }
         this.#newSwap(token, type, domain);
      });

   }

   /**
	 * Description. 
	 * @token {string} The random token for the swap
	 * @type {string} The type of swap (password, credential, creditCard, or email) 
	 */
	#newSwap(token, type, domain) {
		if (typeof token != 'string') {
			throw new Error('Swap must have a token property that is a string');
		}
		if (type != 'password' && type != 'creditCard' && type != 'email' && type != 'username') {
			throw new Error('Swap must have a type property that is a string');
		}
		if (typeof domain != 'string') {
			throw new Error('Swap must have a domain property that is a string');
		}

		let swap = {
			type: type,
			token: token,
			authId: 'A413', //TODO: Make it change
			domain: domain
		};
		super.notify('contextMenuSwapReady', swap);
	}
}