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


function createMenus() {
	

   chrome.contextMenus.create({
      id: credTypes.password,
      title: "Password",
      visible: true
   });

   chrome.contextMenus.create({
      id: credTypes.creditCard,
      title: 'Credit Card',
      visible: true
   });

   chrome.contextMenus.create({
      id: credTypes.username,
      title: 'Username',
      visible: true
   });

   chrome.contextMenus.create({
      id: credTypes.email,
      title: 'Email',
      visible: true
   });
}