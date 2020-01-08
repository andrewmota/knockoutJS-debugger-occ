chrome.windows.onFocusChanged.addListener(function(windowId) {
	chrome.tabs.getSelected(null, function(tab) {
        if (tab && tab.hasOwnProperty('id')) {
            chrome.tabs.sendMessage(tab.id, {}, function(response) {
                
            });
        }
	});
});

chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function (msg) {
		if (msg.action === 'register') {
			var respond = function (tabId, changeInfo, tab) {
				if (tabId !== msg.inspectedTabId) {
					return;
				}
				port.postMessage('refresh');
			};

			chrome.tabs.onUpdated.addListener(respond);
			port.onDisconnect.addListener(function () {
				chrome.tabs.onUpdated.removeListener(respond);
			});
		}
	});
});