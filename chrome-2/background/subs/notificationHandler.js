
class NotificationHandler extends Subscriber {

	constructor() {
		/* Singleton design pattern */
		if (NotificationHandler._instance) {
			return NotificationHandler._instance;
		}
		super();

		new IoHandler().subscribe(this);
		new AuthHandler().subscribe(this);

		
	}

	update(event, opts) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
      }
		let notTitle = '';
		let notMsg;
		switch(event) {

			case 'authLoginFail':
				notTitle = 'Authorization Fail';
				break;

			case 'authLoginSucces':
				notTitle = 'Authorization Success';
				break;

			case 'authJwtRefreshFail':
				notTitle = 'Authorization Fail';	
				break;

			case 'ioNewTrustedConn':
				notTitle = 'Trusted Device Connected';
				break;

			case 'ioNewTrustedDisconn':
				notTitle = 'Trusted Device Disconnected';
				break;

			case 'ioSwapApproved':
				notTitle = 'Swap Approved';	
				break;
			
			case 'ioSwapDenied':
				notTitle = 'Swap Denied';
				break;

			case 'ioSwapError':
				notTitle = 'Swap error';	
				break;

			default: 
				return;
		}

		chrome.notifications.create(
			'name-for-notification',{   
			type: 'basic', 
			iconUrl: '/icons/icon.png', 
			title: notTitle,
			message: notTitle 
		});

	}
}