

class ContentScriptHandler extends Subscriber {

	constructor() {
		/* Singleton design pattern */
		if (ContentScriptHandler._instance) {
			return ContentScriptHandler._instance;
		}
		super();
		ContentScriptHandler._instance = this;

		new ContextMenu().subscribe(this);
	}

	update(event, opts) {
      /* Check parameters */
      if (typeof event != 'string') {
         throw new Error('event must be a string');
		}
		/* Pass through all messages to content script */
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {event, opts});
		});
	}
}