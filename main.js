var RandomEpisode = {

	init: function () {
		chrome.browserAction.onClicked.addListener(RandomEpisode.go);
	},

	go: function () {
		console.log('it works');
	}
};

RandomEpisode.init();
