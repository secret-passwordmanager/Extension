login = new LoginHandler();
popup = new PopUpHandler();
contentScript = new ContentScriptHandler();

setTimeout(() => {
   login.login();
}, 5000);