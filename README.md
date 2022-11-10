# Send to Webhook - A Firefox Extension

Sends hovered link (or current page if no link is hovered) to configured Webhook. The HTTP method and JSON body can be configured in the extension options.

## Installation

Since this is a small project for myself, I am not going to get it signed, or publish it. Instead, install it manually.

### Step 1

```
$ git clone https://github.com/browningluke/Firefox-SendToWebhook.git
$ cd Firefox-SendToWebhook
$ zip -r -FS ../send-to-webhook.zip *
```

### Step 2

Go to `about:config`, change `xpinstall.signatures.required` to `false`.

### Step 3

Go to `about:addons`, and choose `Install Add-on from file option`, select the `send-to-webhook.zip`.

### Step 4

Go to `about:config`, change `xpinstall.signatures.required` to `true`.


## Config

```jsonc
{
    "webhook": {
        "url": "<URL>",       // required
        "method": "PATCH",    // optional, defaults to POST
        "format": {           // optional, defaults to { "content": "<DATA>" }
            "data": "<DATA>"
        }
    }
}
```

### Config Example

```jsonc
{
    "webhook1": {
        "url": "<URL>",
    },
    "webhook2": {
        "url": "<URL>",
        "method": "PUT",
    },
    "webhook3": {
        "url": "<URL>",
        "method": "PATCH",
        "format": {
            "data": "<DATA>"
        }
    }
}

```

```
webhook 1:
POST to <URL>
{
    "content": "[selected link]"
}

---

webhook 2:
PUT to <URL>
{
    "content": "[selected link]"
}

---

webhook 3:
PATCH to <URL>
{
    "data": "[selected link]"
}
```
