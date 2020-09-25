
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
			'ioNewTrustedDisconn',
			'ioSwapQueueEmpty',
			'ioSwapSubmitted',
			'ioSwapApproved',
			'ioSwapDenied',
			'ioSwapError'
		]);
		IoHandler._instance = this;

		/* Subscribe to events */
		new ContextMenu().subscribe(this);
		new AuthHandler().subscribe(this);
	}

	update(event, opts) {
		/* Check params */
		if (typeof event != 'string') {
			throw new Error('event must be a string');
		}

		switch (event) {
			case 'authJwtRefreshSuccess':
				this.#connect();
				break;


			case 'contextMenuSwapReady':
				this.#submitSwap(opts);
				break;
		}
	}

	#submitSwap(swap) {
		if (this.#socket === null) {
			return new Error('No connection to swapman');
		}
		try {
			this.#socket.emit('swapNew', swap);
			super.notify('ioSwapSubmitted', swap);
		}
		catch(err) {
			super.notify('ioSwapError', err.message);
			return err;
		}

	}

	getNumSwaps() {
		if (this.#socket === null) {
			return new Error('No connection to swapman');
		}
		this.#socket.emit('swapsNumPending', (numSwaps) => {
			return numSwaps;
		});
	}

	#connect() {

		/* If already connected, don't do anything */
		if (this.#socket != null) {
			console.log('socket is not null')
			return;
		}

		chrome.storage.local.get(['jwt'], (storage) => {

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
				super.notify('ioNewTrustedDisconn', null);
			});
			this.#socket.on('swapEmpty', () => {
				super.notify('ioSwapQueueEmpty');
			});
			this.#socket.on('err', (error) => {
				super.notify('ioSwapError');
				console.log(error);
			});
			this.#socket.on('swapApproved', (swap) => {
				super.notify('ioSwapApproved', swap);
			})
			this.#socket.on('swapDenied', (swap) => {
				super.notify('ioSwapDenied', swap);
			})
		

      });
	}

}