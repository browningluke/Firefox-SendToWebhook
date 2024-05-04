const BROWSER_STORAGE_KEY = "stwConfig";
const MAX_SYNC_BYTES = 8192;

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function validateAndParseData(text) {
    if (!isJsonString(text)) {
        alert("Invalid JSON string.");
        return null;
    }

    return JSON.parse(text);
}

function redrawTextBox() {
    // Write JSON config to text if storage already exists
    browser.storage.local.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        if (!item[BROWSER_STORAGE_KEY]) return;
        
        let jsonPretty = JSON.stringify(item[BROWSER_STORAGE_KEY], null, 2);
        document.getElementById("jsondatatext").value = jsonPretty;
    });
}

function redrawCurrentlyUsedBytes() {
    let elem = document.getElementById("cloud-in-use");
    
    browser.storage.sync.getBytesInUse(BROWSER_STORAGE_KEY)
    .then((val) => {
        elem.innerText = `${val}/${MAX_SYNC_BYTES}`;
        console.log(`Got currently in-use bytes ${val}.`)
    }, (error) => {
        elem.innerText = `??/${MAX_SYNC_BYTES}`;
        console.log(error);
    });
}

function saveLocal(data) {
    browser.storage.local.set({
        [BROWSER_STORAGE_KEY]: data
    }).then(() => {
        console.log("Saved to local storage successfully.");
        
        // Trigger reconstruction of context menus
        browser.runtime.sendMessage("context");

        // Redraw textbox to ensure synced with storage
        redrawTextBox();
    }, (error) => {
        alert("Failed to save to local storage.");
        console.log(error);
    });
}

function saveToCloud(data) {
    // Test size
    let dataSize = new Blob([BROWSER_STORAGE_KEY, JSON.stringify(data)]).size;
    if (dataSize >= MAX_SYNC_BYTES) {
        alert(`JSON object too large to sync. ${dataSize}/${MAX_SYNC_BYTES} bytes`);
        return;
    }

    browser.storage.sync.set({
        [BROWSER_STORAGE_KEY]: data
    })
    .then(() => {
        redrawCurrentlyUsedBytes();
        console.log("Saved to cloud successfully.");
    }, (error) => {
        alert("Failed to save to cloud.");
        console.log(error);
    });
}

function loadFromCloud() {
    browser.storage.sync.get(BROWSER_STORAGE_KEY)
    .then((item) => {
        if (!item[BROWSER_STORAGE_KEY]) {
            alert("No cloud data found, keeping current config.");
            return;
        }

        // Found valid data (which must be valid, or else wouldn't have been saved)
        // Save to local storage (overwriting current )
        console.log("Loaded from cloud succesfully.")
        saveLocal(item[BROWSER_STORAGE_KEY]);

        // Redraw in-use bytes
        redrawCurrentlyUsedBytes();
    })
}

function onReady() {
    redrawTextBox();
    redrawCurrentlyUsedBytes();

    // Handle form submission
    document.getElementById('stw-options').addEventListener("submit", (event) => {
        event.preventDefault();
        let userText = event.target.elements.jsondatatext.value;
        let data;

        // Check which button was clicked
        switch (event.submitter.id) {
            case "save":
                // Local save (to browser storage)
                data = validateAndParseData(userText);
                if (data == null) return;
                
                saveLocal(data);
                break;
            case "save-cloud":
                // Cloud save (to generic browser sync)
                data = validateAndParseData(userText);
                if (data == null) return;
                
                saveToCloud(data);
                break;
            case "load-cloud":
                // Cloud load (from generic browser sync)
                let userConfirm = confirm("Load config from cloud? This will overwrite the local config.");
                if (!userConfirm) return;
                
                loadFromCloud();
                break;
            default:
                alert("Invalid submitter id.");
                break;
        }        
    });
}

window.addEventListener('load', onReady);
