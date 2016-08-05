import browser from 'browser';

browser.browserAction.onClicked.addListener(() => {
    console.log('clicked');
});
