'use strict';

var page_elem = document.querySelector('#twitch-video');
console.log(page_elem);

var div = document.createElement('div');
var p = document.createElement( 'p' );
var a = document.createElement( 'a' ); 

div.id = "gdq_speedrun_link"
p.innerHTML = "";

div.appendChild(p);
div.appendChild(a);
page_elem.appendChild(div);

var port = chrome.runtime.connect({name: "gdq"});
port.postMessage({message: "request"});
port.onMessage.addListener(function(msg) {
  if (msg.status == "changed") {
    console.log(msg);
    p.innerHTML = msg.game;
    a.href = msg.link;
    a.innerHTML = msg.link;
  } else if (msg.status == "unchanged") {
    console.log("Current game has not changed since last request");
  } else if (msg.status == "reload") {
    console.log("Reload has occurred");
    p.innerHTML = msg.game;
    a.href = msg.link;
    a.innerHTML = msg.link;
  }
});

function requestDataFromBackground() {
	port.postMessage({message: "request"});
}
setInterval(requestDataFromBackground, 300000)