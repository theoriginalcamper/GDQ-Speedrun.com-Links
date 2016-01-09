'use strict';

// chrome.runtime.onInstalled.addListener(details => {
//   console.log('previousVersion', details.previousVersion);
// });
var current_game = null;
var current_link = null;
var portForMessage = null;
chrome.runtime.onConnect.addListener(function(port) {
  portForMessage = port;
  console.assert(port.name == "gdq");
  port.onMessage.addListener(function(msg) {
    if (msg.message == "request")
      $.getJSON("https://api.twitch.tv/channels/gamesdonequick").done(function(resp) {
        console.log("Completed request to Twitch");

        if (current_game != resp.game) {
          console.log("The Current Game being run is:")
          console.log(resp.game);
          
          current_game = resp.game;
          getSpeedrunData(current_game, port);
          console.log(current_link);
        } else {
          console.log("Still the same");
        }
      });
  });
});

function getSpeedrunData(game, port) {
  $.getJSON("http://www.speedrun.com/api/v1/games?name=" + game).done(function(resp) {
    console.log("Completed request to Speedrun.com");

    current_link = resp.data[0].weblink;
    console.log("Retrieved link is:")
    console.log(current_link);

    port.postMessage({status: "changed", game: current_game, link: current_link});
  })
}

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (tab.url.indexOf("https://gamesdonequick.com") > -1 && changeInfo.url === undefined){
    portForMessage.postMessage({status: "reload", game: current_game, link: current_link});
  }
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (tab.url.indexOf("http://gamesdonequick.com") > -1 && changeInfo.url === undefined){
    portForMessage.postMessage({status: "reload", game: current_game, link: current_link});
  }
});