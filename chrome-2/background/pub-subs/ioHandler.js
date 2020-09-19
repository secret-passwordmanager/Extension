
/**
 * This is the one weird case where 
 * a publisher is also a subscriber
 */
class IoHandler extends PubSub {

	#socket = null;
	#numSwaps = 0;

	constructor() {
		/* Singleton design pattern */
		if (IoHandler._instance) {
			return IoHandler._instance;
		}
		super([
			'ioNewTrustedConn',
			'ioNewTrustedDiscon',
			'ioSwapQueueEmpty',
			'ioSwapApproved',
			'ioSwapDenied'
		]);
		IoHandler._instance = this;

		/* Subscribe to events */
		new ContextMenu().subscribe(this);
	}

	update(event, opts) {
		/* Check params */
		if (typeof event != 'string') {
			throw new Error('event must be a string');
		}

		switch (event) {
			case 'contextMenuSwapReady':
				if (this.#socket == null) {
					this.#connect();
				}
				++this.#numSwaps;
				this.#submitSwap(opts);
				break;
		}
	}

	#submitSwap(swap) {
		if (this.#socket === null) {
			return new Error('No connection to swapman');
		}

		this.#socket.emit('swapNew', swap);
	}

	#connect() {
		chrome.storage.local.get(['jwt'], (storage) => {
         console.log(storage);

         if (typeof storage.jwt != 'string') {
            return new Error('Cannot connect without a jwt');
         }

         this.#socket = io.connect(services.swap.url, {
            query: storage
			});
			this.#socket.on('connectionNew', () => {
				super.notify('ioNewTrustedConn', null);
			});
			this.#socket.on('connectionDisconnect', () => {
				super.notify('ioNewTrustedDisConn', null);
			});
			this.#socket.on('swapEmpty', () => {
				super.notify('ioSwapQueueEmpty');
			})
      });
	}

}``