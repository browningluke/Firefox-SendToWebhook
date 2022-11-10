const DISCORD_WEBHOOK = {
    "send-link-to-discord-general": "<WEBHOOK_URL>"
}
const rootID = browser.contextMenus.create({
    id: "send-link-to-discord",
    title: "Send link to Discord",
    contexts: ["all"],
});

browser.contextMenus.create({
    id: "send-link-to-discord-general",
    title: "General",
    contexts: ["all"],
    parentId: rootID,
});


function sendToDiscord(url, content) {
        let data = {
          "content": content,
          "embeds": null,
          "attachments": []
        };

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then();
}


browser.contextMenus.onClicked.addListener((info, tab) => {
    let content = "";
    if (info.linkUrl) {
        content = info.linkUrl;
    } else {
        content = tab.url;
    }

    let url = DISCORD_WEBHOOK[info.menuItemId];
    if (!url) return;
    sendToDiscord(url, content);
});

