// Create context menus
browser.contextMenus.create({
  id: "context-go-to-the-login-page",
  title: "Go to the login page"
});

function onUpdated(tab) {
  // console.log(`[LoginPageShortcutAddon] Updated tab: ${tab.id}`);
}
  
function onError(error) {
  console.log(`[LoginPageShortcutAddon] Error: ${error}`);
}

function updateTab(inputUrl) {
  let updating = browser.tabs.update(browser.tabs.getCurrent().id, {
    active: true,
    url: inputUrl
  });
  updating.then(onUpdated, onError);
}

function redirectTo(loginUrl) {
  if(loginUrl === "")
    return;
  
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0];
    if(tab.url === loginUrl){
      console.log("[LoginPageShortcutAddon] It seems current page is login page : " + loginUrl);
    }
    else{
      console.log("[LoginPageShortcutAddon] Go to the login page : " + loginUrl);
      let querying = browser.tabs.query({currentWindow:true});
      querying.then(updateTab(loginUrl), onError);
    }
  }, console.error);
}

function requestFindLoginPage() {
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, {
      from: "requestFindLoginPage"
    });
  }, console.error);
}

// Add keyboard command listener
browser.commands.onCommand.addListener((command) => {
  if (command == "go-to-the-login-page") {
      requestFindLoginPage();
  }
 });

 // Add context menu listener
 browser.contextMenus.onClicked.addListener(function(info, tab) {
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