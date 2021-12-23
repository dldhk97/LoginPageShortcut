function findLoginpage() {
  let hyperlinkElems = document.getElementsByTagName("a");
  let loginUrl = "";

  for (let i = 0 ; i < hyperlinkElems.length ; i++){
    let hyplinkElem = hyperlinkElems[i];

    if (hyplinkElem.href.match("(L|l)ogin")) {
      loginUrl = hyplinkElem.href;
      break;
    }
  }
  if(loginUrl !== ""){
    sendLoginPageUrl(loginUrl);
  }
    
}

function sendLoginPageUrl(loginUrl) {
  chrome.runtime.sendMessage({
    from:"returnFindLoginPage",
    url: loginUrl
  });
}

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.from == "requestFindLoginPage") {
    findLoginpage();
  }
});