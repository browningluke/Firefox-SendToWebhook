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
