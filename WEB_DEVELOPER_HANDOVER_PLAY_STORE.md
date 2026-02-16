# Handover for Web Developer – Play Store Fixes (reepls.com)

All changes below are **on the website (reepls.com) only**. No mobile app code changes are required.

---

## 1. Digital Asset Links file (fixes deep links / “Link not working”)

### What to do

1. **Create a file** named `assetlinks.json` with the **exact** content below.
2. **Host it** at this exact URL:  
   **`https://reepls.com/.well-known/assetlinks.json`**
3. **Required:** The server **must** respond with this HTTP header:  
   **`Content-Type: application/json`**  
   (Without this, Google reports “JSON content type failed”.)

### Exact file content for `assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.reepls.app",
      "sha256_cert_fingerprints": [
        "A0:53:95:BE:20:3D:B3:91:73:A6:57:6E:CA:84:F9:06:81:A0:94:AC:EF:7E:64:4B:C8:19:55:A9:A1:16:0D:7F"
      ]
    }
  }
]
```

### Server config (Content-Type)

- **Nginx:** For the path `/.well-known/assetlinks.json`, set `default_type application/json;` (or `add_header Content-Type application/json;`).
- **Apache:** For that path, set `Header set Content-Type "application/json"`.
- **Vercel:** In `vercel.json`, add a header for `/.well-known/assetlinks.json` with `Content-Type: application/json`.
- **Netlify:** In `_headers`, add `/.well-known/assetlinks.json` with `Content-Type: application/json`.
- **Other:** Ensure the response for `https://reepls.com/.well-known/assetlinks.json` has header `Content-Type: application/json`.

### Check

- Open `https://reepls.com/.well-known/assetlinks.json` in a browser.
- In DevTools → Network → select that request → Response headers should show: `Content-Type: application/json`.

---

## 2. Child Safety Standards page (fixes “Missing Published Standards”)

### What to do

1. **Publish a page** that states Reepls’ child safety standards and **explicitly prohibits CSAE** (Child Sexual Abuse and Exploitation).
2. **URL:** Any public URL on reepls.com is fine, e.g.  
   **`https://reepls.com/child-safety`** or **`https://reepls.com/standards`** or **`https://reepls.com/policies/child-safety`**.
3. The page must:
   - Load without error (functional).
   - Mention child safety / CSAE (relevant).
   - Reference the app name **Reepls** (as on Google Play).

### Content to use (or adapt)

You can use the content from **`docs/child-safety-standards-template.html`** in this repo. Minimum content to include:

- **Reepls** is committed to the safety of all users, especially children.
- **Reepls** explicitly **prohibits** content and conduct that constitutes or facilitates **Child Sexual Abuse and Exploitation (CSAE)** (e.g. CSAM, grooming, sexualization of minors).
- Enforcement (e.g. removal, account action, reporting to authorities).
- How users can report (e.g. in-app or contact email).
- Clear reference to the app name **Reepls** (as on Google Play).

The file `docs/child-safety-standards-template.html` is a full HTML template; the web developer can copy its content into the site’s CMS or template and match the site’s design.

---

## Summary for web developer

| Task | URL | Requirement |
|------|-----|-------------|
| **1. Asset links** | `https://reepls.com/.well-known/assetlinks.json` | Serve the JSON above with **`Content-Type: application/json`**. |
| **2. Child safety page** | e.g. `https://reepls.com/child-safety` | Publish the child safety / CSAE prohibition content and reference **Reepls**. |

**Yes – these changes are only for the web (reepls.com).** No app or backend code changes are needed for these two items.

After the web work is done:

- **Deep links:** In Google Play Console → Deep links → **Recheck verification**.
- **Child safety:** In Play Console → App content (or Policy status) → add the URL of the child safety page where requested, then resubmit or appeal.
