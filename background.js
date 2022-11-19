const BROWSER_CONTEXT_ID_PREFIX = "stw-";
const BROWSER_STORAGE_KEY = "stwConfig";


function setupContextMenu() {
    // Assume valid data is stored in browser.storage
    
    // Remove all context menu items
    browser.contextMenus.removeAll();

    // Create root context menu 
    const rootID = browser.contextMenus.create({
        id: `${BROWSER_CONTEXT_ID_PREFIX}root`,
        title: "Send link to Webhook",
        contexts: ["all"],
    });

    // Load user config from browser.storage
    browser.storage.local.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        // Create all context menus
        for (const x in item[BROWSER_STORAGE_KEY]) {
            browser.contextMenus.create({
                id: `${BROWSER_CONTEXT_ID_PREFIX}${x}`,
                title: x,
                contexts: ["all"],
                parentId: rootID,
            });
        }
    });
}

browser.runtime.onMessage.addListener(setupContextMenu);
browser.runtime.onStartup.addListener(setupContextMenu);

function sendToWebhook(url, content, method="POST", format={"content": "<DATA>"}) {
    let data = format;
    for (const x in data) {
        if (data[x] == "<DATA>") {
            data[x] = content;
        }
    }

    fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }).then();
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    // Grab content (url of link selected, or page)
    let content = "";
    if (info.linkUrl) {
        content = info.linkUrl;
    } else {
        content = tab.url;
    }
    
    // Load user config from browser.storage
    browser.storage.local.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        // Send to correct channel
        const name = info.menuItemId.replace(BROWSER_CONTEXT_ID_PREFIX, '');
        const webhook = item[BROWSER_STORAGE_KEY][name];

        if (!webhook) return;
        sendToWebhook(webhook.url, content, webhook.method, webhook.format);
    });
});
