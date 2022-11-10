const BROWSER_STORAGE_KEY = "stwConfig";

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function onReady() {
    // Write JSON config to text if storage already exists
    browser.storage.local.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        if (!item) return;
        
        let jsonPretty = JSON.stringify(item[BROWSER_STORAGE_KEY], null, 2);
        document.getElementById("jsondatatext").value = jsonPretty;
    });
    
    // Handle form submission
    document.getElementById('std-options').addEventListener("submit", (event) => {
        event.preventDefault();
        let userText = event.target.elements.jsondatatext.value;
        
        if (!isJsonString(userText)) {
            alert("Invalid JSON string.");
            return;
        }
        
        browser.storage.local.set({
            [BROWSER_STORAGE_KEY]: JSON.parse(userText)
        });

        // Trigger reconstruction of context menus
        browser.runtime.sendMessage("context");
    });
}

window.addEventListener('load', onReady);
