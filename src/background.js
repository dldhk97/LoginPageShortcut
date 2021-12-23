// Create context menus
chrome.contextMenus.create({
  id: "context-go-to-the-login-page",
  title: "Go to the login page"
});

function onError(error) {
  console.log(`[LoginPageShortcutAddon] Error: ${error}`);
}

function updateTab(tabId, inputUrl) {
  chrome.tabs.update(tabId, {
    active: true,
    url: inputUrl
  });
}

function redirectTo(loginUrl) {
  if(loginUrl === ""){
    console.log("[LoginPageShortcutAddon] Login page not found.");
    return;
  }
  
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    let tab = tabs[0];
    if(tab.url === loginUrl){
      console.log("[LoginPageShortcutAddon] It seems current page is login page : " + loginUrl);
      return;
    }
    console.log("[LoginPageShortcutAddon] Go to the login page : " + loginUrl);
    updateTab(tab.id, loginUrl);
  });
  
}

function requestFindLoginPage() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      from: "requestFindLoginPage"
    });
  });
}

// Add keyboard command listener
chrome.commands.onCommand.addListener((command) => {
  if (command == "go-to-the-login-page") {
      requestFindLoginPage();
  }
 });

 // Add context menu listener
 chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "context-go-to-the-login-page") {
      requestFindLoginPage();
  }
});

// content-script communication listener
chrome.runtime.onMessage.addListener(function(msg,sender) {
  if (msg.from == "returnFindLoginPage") {
    redirectTo(msg.url);
    return;
  }
});