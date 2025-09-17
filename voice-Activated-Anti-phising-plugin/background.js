chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_URL") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        sendResponse({url: tabs[0].url});
      } else {
        sendResponse({url: null});
      }
    });
    return true;
  }
});