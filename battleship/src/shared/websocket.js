import WebSocketAsPromised from 'websocket-as-promised';



class WebSocketClient {
	constructor() {
		if (!WebSocketClient.instance) {
			WebSocketClient.instance = this;
		}
		this.listeners = [];
		this.onOpenListeners = [];
		this.onCloseListeners = [];
		this.close = false;
		this.reconnection = () => { };
		this.wsp = new WebSocketAsPromised(process.env.REACT_APP_WS_URL + (process.env.PORT || 80) + process.env.REACT_APP_WS_PATH, {
			packMessage: data => JSON.stringify(data),
			unpackMessage: data => JSON.parse(data),
		});
		this.addListeners();
	}

	getInstance() {
		return WebSocketClient.instance;
	}

	closeConnection() {
		this.close = true;
		if (this.wsp.isOpened) {
			return this.wsp.close().then(() => {
				clearInterval(this.reconnection)
				WebSocketClient.instance = false;
			});
		} else {
			clearInterval(this.reconnection)
			WebSocketClient.instance = false;
		}
	}

	async openConnection() {
		if (this.close) this.close = false;
		if (!this.wsp.isOpened && !this.wsp.isClosing) {
			await this.wsp.open();
		}
		return;
	}

	addListeners() {
		this.wsp.onClose.addListener(async () => {
			if (!this.close) {
				this.reconnection = setInterval(async () => {
					if (this.wsp.isClosed && !this.close) {
						this.openConnection().then((wsp) => {
							if (this.wsp.isOpened) {
								clearInterval(this.reconnection);
							}
						})
					}
				}, 100)
			}
		});
		this.onOpenListeners.forEach(listener => {
			this.wsp.onOpen.addListener(listener);
		})
		this.onCloseListeners.forEach(listener => {
			this.wsp.onClose.addListener(listener);
		})
		this.listeners.forEach(listener => {
			this.wsp.onUnpackedMessage.addListener(listener);
		});
	}

	addOnMessageListener(callback) {
		this.wsp.onUnpackedMessage.addListener(callback);
		this.listeners.push(callback);
		return () => {
			this.listeners = this.listeners.filter(listener => listener !== callback)
			this.wsp.removeAllListeners();
			this.addListeners();
		}
	}

	addOnOpenListener(callback) {
		if(this.onOpenListeners.find(listener => listener === callback)) return;
		this.onOpenListeners.push(callback);
		this.wsp.onOpen.addListener(callback);
	}

	addOnCloseListener(callback) {
		if(this.onCloseListeners.find(listener => listener === callback)) return;
		this.onCloseListeners.push(callback);
		this.wsp.onClose.addListener(callback);
	}

	removeOnCloseListener(callback) {
		this.onCloseListeners = this.onCloseListeners.filter(listener => listener !== callback);
		this.wsp.removeAllListeners();
		this.addListeners();
	}

	removeOnOpenListener(callback) {
		this.onOpenListeners = this.onOpenListeners.filter(listener => listener !== callback);
		this.wsp.removeAllListeners();
		this.addListeners();
	}

	async sendMessage(message) {
		await this.openConnection();
		if (this.wsp.isOpened) {
			this.wsp.sendPacked(message);
			return;
		} else {
			this.wsp.onOpen.addOnceListener(() => {
				this.wsp.sendPacked(message);
				return;
			})
		}
	}

}

export default new WebSocketClient().getInstance();