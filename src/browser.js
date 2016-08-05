export default {

    onIconClick: (cb) => {
        return window.chrome.browserAction.onClicked.addListener(cb);
    }
};
