function createMenus() {
	// create the menus
	fields = ["username", "password", "email"]
	
	var i;
	for (i = 0; i < fields.length; i++) {
		browser.menus.create({
			id: fields[i],
			title: fields[i],
			documentUrlPatterns: ["https://*/*", "http://*/*"],
			contexts: ["editable"]
		});
	}

	browser.menus.create({
		id: "separator",
		type: "separator",
		contexts: ["editable"]
	});

	browser.menus.create({
		id: "previous",
		title: "Previous value",
		documentUrlPatterns: ["https://*/*", "http://*/*"],
		contexts: ["editable"]
	});
}


var logged_in;
var previous = "";

createMenus();

// fillout the values
browser.menus.onClicked.addListener(async (info, tab) => {
	var type = info.menuItemId;
	await browser.browserAction.openPopup();

	var value = "Please Login first";
	var credentialType;

	if (logged_in) {

		switch (type) {
			case "previous":
				credentialType = 404;
				value = previous;
				break;
			case "password":
				credentialType = 0;
				value = makePassword();
				break;
			case "username":
				credentialType = 2;
				value = makeUsername();
				break;
			case "email":
				credentialType = 3;
				value = makeEmail();
				break;
		}
	}

	previous = value;
	var vars = {
		input: info.targetElementId,
		data: value
	};

	browser.tabs.executeScript(tab.id, {
		allFrames: true,
		code: 'var vars = ' + JSON.stringify(vars)
	}, function () {
		browser.tabs.executeScript(tab.id, {
			allFrames: true,
			file: 'script.js'
		});
	});

	if (logged_in && credentialType != 404) {
		new_pin = random4Digit();
		browser.storage.local.set({'pin': new_pin}, function() {
			console.log("pin set to" + new_pin);
		});
		var json = {
			FieldId: type,
			RandToken: value,
			domain: domain_from_url(tab.url),
			type: credentialType,
			AuthId: parseInt(new_pin, 10)
		};
		browser.storage.local.get(['token'], function(result) {
			var bearer = 'Bearer ' + result.token;
			fetch('http://localhost:8000/swap/new', {
				method: 'POST',
				withCredentials: true,
				credentials: 'include',
				headers: {
					'Authorization': bearer,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(json)
			})
		});
	}
});


// identification credentials
var defaultSettings = {
	token: "null",
	pin: "null",
	status: "null",
	proxy : "null"
};

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
function checkStoredSettings(storedSettings) {
	if (!storedSettings.token) {
		browser.storage.local.set(defaultSettings);
	}
}

function checkPin(storedSettings) {
	sendMsg(storedSettings.pin);
}

function checkProxy(storedSettings) {
	sendMsg(storedSettings.status);
}

function onError(e) {
	console.error(e);
}

function checkStatus() {
	browser.storage.local.get(['token'], function(result) {
		if (result.token == "null") {
			sendMsg("login");
		} else {
			var noResponse = setTimeout(function () { sendMsg("failure"); }, 3500);
			var url = "http://localhost:8000/swap/";
			var bearer = 'Bearer ' + result.token;
			fetch(url, {
				method: 'GET',
				withCredentials: true,
				credentials: 'include',
				headers: {
					'Authorization': bearer,
					'Content-Type': 'application/json'
				}
			}).then(response => {
				clearTimeout(noResponse);
				if (response.ok) {
					logged_in = true;
					if (response.status == "204") {
						sendMsg("success");
					} else {
						sendMsg("warning");
					}
				} else {
					sendMsg("failure");
				}
			});
		}
	});
}


function login(info) {
	var noResponse = setTimeout(function () { sendMsg("failure"); }, 3500);
	fetch('http://localhost:8000/user/authenticate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: info,
	}).then(response => {
		clearTimeout(noResponse);
		if (response.ok) {
			return response.json();
		} else {
			return false;
		}
	}).then(body => {
		if (body) {
			browser.storage.local.set({'token': body.token}, function() {
				console.log("token set to" + body.token);
				checkStatus();
			});
		} else {
			sendMsg("failure");
		}
	});
}

// popup communication
function sendMsg(msg) {
	browser.runtime.sendMessage({
		msg: msg
	});
}

function handleMessage(request, sender, sendResponse) {
	console.log("request from popup: " + request.msg);

	if (request.msg == "check_status") {
		const gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(checkStatus, onError);
	} else if (request.msg == "check_proxy") {
		const gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(checkProxy, onError);
	} else if (request.msg == "check_pin") {
		const gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(checkPin, onError);
	} else {
		var data = JSON.parse(request.msg);
		if (data.type == "login"){
			login(JSON.stringify(data.creds));
		} else {
			toggleProxy(data);
		}		
	}
}

browser.runtime.onMessage.addListener(handleMessage);

// auxiliary
function makeUsername() {
	var length = 8,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

function makePassword(len) {
	var length = (len) ? (len) : (10);
	var string = "abcdefghijklmnopqrstuvwxyz"; //to upper
	var numeric = '0123456789';
	var punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
	var password = "";
	var character = "";
	while (password.length < length) {
		entity1 = Math.ceil(string.length * Math.random() * Math.random());
		entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
		entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
		hold = string.charAt(entity1);
		hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
		character += hold;
		character += numeric.charAt(entity2);
		character += punctuation.charAt(entity3);
		password = character;
	}
	password = password.split('').sort(function () { return 0.5 - Math.random() }).join('');
	return password.substr(0, len);
}

function makeEmail() {
	var strValues = "abcdefg12345";
	var strEmail = "";
	var strTmp;
	for (var i = 0; i < 10; i++) {
		strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
		strEmail = strEmail + strTmp;
	}
	strTmp = "";
	strEmail = strEmail + "@";
	for (var j = 0; j < 8; j++) {
		strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
		strEmail = strEmail + strTmp;
	}
	strEmail = strEmail + ".com"
	return strEmail;
}


function domain_from_url(url) {
	var result
	var match
	if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
		result = match[1]
		if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
			result = match[1]
		}
	}
	return result
}

function random4Digit(){
  return shuffle( "0123456789".split('') ).join('').substring(0,4);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


// Listen for a request to open a webpage
function toggleProxy(data) {

	browser.storage.local.set({'status': data.status}, function() {
		console.log("proxy status set to" + data.status);
	});
	
	var info = {
		'host' : data.host,
		'port' : data.port
	}
	info = JSON.stringify(info);

	browser.storage.local.set({'proxy': info}, function() {
		console.log("proxy set to" + info);
	});

	if (data.status == "on") {
		browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ["<all_urls>"] });
	} else {
		browser.proxy.onRequest.removeListener(handleProxyRequest, { urls: ["<all_urls>"] });
	}
}

// On the request to open a webpage
function handleProxyRequest(requestInfo) {
	// Read the web address of the page to be visited
	const url = new URL(requestInfo.url);

	browser.storage.local.get(['proxy'], function(result) {
		var info = JSON.parse(result.proxy);
		var prt = parseInt(info.port);
	
		// Determine whether the domain in the web address is on the blocked hosts list
		if ((requestInfo.method == "POST" && url.hostname != "localhost") || url.hostname == "mitm.it") {
			// Write details of the proxied host to the console and return the proxy address
			console.log(`Proxying: ${url.hostname}`);
			console.log(info.host);
			console.log(prt);
			return { type: "http", host: "localhost", port: 8001 };
		}
		// Return instructions to open the requested webpage
		return { type: "direct" };
	});
}
