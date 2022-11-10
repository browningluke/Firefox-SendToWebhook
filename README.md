# Send to Webhook - A Firefox Extension
<div align="center">
<a href="https://github.com/browningluke/Firefox-SendToWebhook/releases/latest/download/SendToWebhook.xpi"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" width="126px"></a> 
</div>
Sends hovered link (or current page if no link is hovered) to configured Webhook. The HTTP method and JSON body can be configured in the extension options.

## Installation from Source

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
