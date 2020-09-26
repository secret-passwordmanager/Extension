/**
 * Description. This is the "main" of the code
 * that handles the popup. This should be the 
 * only place where there is code outside of a
 * function
 */

//////////////////////////////////////////////
////////////////// Runtime ///////////////////
//////////////////////////////////////////////

/* Listen for certain events from the background */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {
            case 'authLoginFail':
                console.log('Cannot authorize. Probably invalid credentials');
                break;
            
            case 'authLoginSuccess':
                switchView('home');
                break;
    
            case 'authLogoutSuccess':
                switchView('login');
                console.log('logged out');
                break;
            
            case 'authJwtRefreshFail':
                switchView('login');
                break;
    
            case 'ioSwapApproved':
                swaps.splice(swaps.indexOf(request.opts), 1);
                break;
    
            case 'ioSwapDenied':
                swaps.splice(swaps.indexOf(request.opts), 1);
                break;
    
            case 'ioSwapSubmitted':
                swaps.push(opts);
                break;
        }
    }
);

 /* Default to login when started */
 switchView('login');
 
 /* Try to auto login when started */
 autoLogin();

 /* Get all pending swaps when started */
 getSwaps();
 
 /* Make login button login */
 document.getElementById('loginBtn').addEventListener(
    'click', () => {
       login(document.getElementById('usernameInput').value, document.getElementById('passwordInput').value);
    }
 );
 
 /* Make logout button log out */
 document.getElementById('btnLogout').addEventListener('click', logout);
 

 /* Make settings button go to settings */
 document.getElementById('btnSettings').addEventListener('click', () => {
    switchView('settings');
 });
 
 /**
  * This way, if the user is logged in, it will take them to the home
  * view, but if they are not, it will take them to the login view.
  */
 document.getElementById('btnHome').addEventListener('click', autoLogin);


 document.getElementById('btnIp').addEventListener('click', () => {
    editIp(document.getElementById('inputIp').value);
 });