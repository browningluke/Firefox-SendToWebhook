const BROWSER_CONTEXT_ID_PREFIX = "stw-";
const BROWSER_STORAGE_KEY = "stwConfig";

browser.runtime.onMessage.addListener((message, sender, reply) => {
    // Assume valid data is stored in browser.storage
    
    // Remove all context menu items
    browser.contextMenus.removeAll();

    // Create root context menu 
    const rootID = browser.contextMenus.create({
        id: "send-link-to-discord",
        title: "Send link to Discord",
        contexts: ["all"],
    });

    // Load user config from browser.storage
    browser.storage.local.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        // Create all context menus
        for (const x in item.stdConfig) {
            browser.contextMenus.create({
                id: `${BROWSER_CONTEXT_ID_PREFIX}${x}`,
                title: x,
                contexts: ["all"],
                parentId: rootID,
            });
        }
    });
});

function sendToDiscord(url, content) {
    let data = {
        "content": content,
        "embeds": null,
        "attachments": []
    };

    fetch(url, {
        method: 'POST',
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
        const url = item[BROWSER_STORAGE_KEY][name];

        if (!url) return;
        sendToDiscord(
            url,
            content
        );
    });
});
