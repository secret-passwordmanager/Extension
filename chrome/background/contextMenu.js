'use strict';

/**
 * Description. This is where the code for 
 * context menu will be. A context menu is
 * a menu that appears when you right click
 * on a browser
 */

const credTypes = {
   password: '0',
   creditCard: '1',
   username: '2',
   email: '3'
}

/**
 * Description. Generates the context
 * menus
 */
function createMenus(browser) {
   browser.contextMenus.create({
      id: credTypes.password,
      title: "Password",
      visible: true,
      contexts: ["editable"]
   });
   // browser.contextMenus.create({
   //    id: credTypes.creditCard,
   //    title: 'Credit Card',
   //    visible: true,
   //    contexts: ["editable"]
   // });
   browser.contextMenus.create({
      id: credTypes.username,
      title: 'Username',
      visible: true,
      contexts: ["editable"]
   });
   browser.contextMenus.create({
      id: credTypes.email,
      title: 'Email',
      visible: true,
      contexts: ["editable"]
   });

   browser.contextMenus.onClicked.addListener(async (info, tab) => {

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
