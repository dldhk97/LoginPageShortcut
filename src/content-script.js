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

  return loginUrl;
}

function sendLoginPageUrl(loginUrl) {
  if(loginUrl === ""){
    console.log("[LoginPageShortcutAddon] Login page not found.");
    return;
  }

  chrome.runtime.sendMessage({
    from:"returnFindLoginPage",
    url: loginUrl
  });
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.from == "requestFindLoginPage") {
    let loginUrl = findLoginpage();
    sendLoginPageUrl(loginUrl); 
  }
});