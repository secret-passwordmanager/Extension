'use strict';

/**
 * Description. This will serve as the our 
 * "main". This should be the only place
 * where any browser specific code should
 * be. Additionally, this should be the 
 * only place where there's any code that
 * is not wrapped in a function
 */
///////////////////////////////////////////////
////////////// Global Variables ///////////////
///////////////////////////////////////////////

createMenus(chrome);
chrome.runtime.onMessage.addListener(msgHandler);