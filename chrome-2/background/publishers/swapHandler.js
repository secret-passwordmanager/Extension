class SwapHandler extends Publisher {

	/**
	 * Description. Will become true if a socket is
	 * currently already open
	 */
	connected = false;


	constructor() {
		/* Singleton design pattern */
		if (SwapHandler._instance) {
			return SwapHandler._instance;
		}
		super(['swapNew', 'swapSuccess', 'swapFail']);
		SwapHandler._instance = this;
	}

	/**
	 * Description. 
	 * @param {Object} swap Has the following parameters:
	 * 	@token {string} The random token for the swap
	 * 	@type {string} The type of swap (password, credential, creditCard, or email) 
	 * 	@domain {string} The domain of the current website
	 */
	newSwap(swap) {



	}

}