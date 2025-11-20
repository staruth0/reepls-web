# Notification Redirect Documentation

This document explains where each notification type redirects users when clicked, including action buttons and default click behavior.

**Base URL Format:** `{baseUrl}{path}`

---

## Action Buttons

### 1. **View Post / View** (`view-post` or `view`)
Redirects to articles or posts based on available data.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/posts/article/slug/my-article-title`
- `https://example.com/posts/article/12345`
- `https://example.com/posts/post/67890`

---

### 2. **View Podcast** (`view-podcast`)
Redirects to podcast detail page.

**URL Patterns:**
- If `podcastId` or `podcast_id` exists: `{baseUrl}/podcast/{podcastId}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/podcast/12345`

---

### 3. **View Stream / View Publication** (`view-publication`)
Redirects to stream detail page.

**URL Patterns:**
- If `url` exists: Uses the provided URL
- If `streamId` or `stream_id` exists: `{baseUrl}/stream/{streamId}`
- If `publicationId` exists: `{baseUrl}/stream/{publicationId}`
- If `article_id` exists and notification type is `publication`: `{baseUrl}/stream/{article_id}`

**Examples:**
- `https://example.com/stream/12345`

---

### 4. **View Profile** (`view-profile`)
Redirects to user profile page.

**URL Patterns:**
- If `url` exists: Uses the provided URL
- If `sender_name` exists: `{baseUrl}/profile/{sender_name}`
- If `sender_id` exists: `{baseUrl}/profile/{sender_id}`

**Examples:**
- `https://example.com/profile/johndoe`
- `https://example.com/profile/12345`

---

### 5. **Reply** (`reply`)
Redirects to the article or post where the comment was made, with comment focus.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}?comment={commentId}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}?comment={commentId}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}?comment={commentId}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}?comment={commentId}`
- Uses `parentCommentId` or `commentId` for the comment parameter

**Examples:**
- `https://example.com/posts/article/slug/my-article?comment=12345` (for article comments)
- `https://example.com/posts/article/67890?comment=12345` (for article comments)
- `https://example.com/posts/post/67890?comment=12345` (for post comments)

---

### 6. **Follow Back** (`follow-back`)
Redirects to profile page with follow action.

**URL Patterns:**
- If `sender_name` exists: `{baseUrl}/profile/{sender_name}?action=follow`
- If `sender_id` exists: `{baseUrl}/profile/{sender_id}?action=follow`

**Examples:**
- `https://example.com/profile/johndoe?action=follow`
- `https://example.com/profile/12345?action=follow`

---

### 7. **Subscribe** (`subscribe`)
Redirects to stream page with subscribe action.

**URL Patterns:**
- If `streamId` or `stream_id` exists: `{baseUrl}/stream/{streamId}?action=subscribe`
- If `publicationId` exists: `{baseUrl}/stream/{publicationId}?action=subscribe`
- If `article_id` exists and notification type is `publication`: `{baseUrl}/stream/{article_id}?action=subscribe`

**Examples:**
- `https://example.com/stream/12345?action=subscribe`

---

### 8. **Read Later / Listen Later** (`later`)
Redirects to bookmarks page.

**URL Pattern:**
- Always: `{baseUrl}/bookmarks`

**Example:**
- `https://example.com/bookmarks`

---

### 9. **Dismiss** (`dismiss`)
Closes the notification without navigation.

**Action:** No redirect, notification is simply closed.

---

## Notification Types - Default Click Behavior

When a notification is clicked (not using action buttons), the redirect depends on the notification type:

### 1. **Reaction** (`reaction`)
Redirects to the article or post where the reaction was made.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/posts/article/slug/my-article` (for article reactions)
- `https://example.com/posts/article/12345` (for article reactions)
- `https://example.com/posts/post/67890` (for post reactions)

---

### 2. **Comment / Comment Reply** (`comment`, `comment-reply`)
Redirects to the article or post where the comment was made.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/posts/article/slug/my-article` (for article comments)
- `https://example.com/posts/article/12345` (for article comments)
- `https://example.com/posts/post/67890` (for post comments)

---

### 3. **Follow** (`follow`)
Redirects to the profile of the user who followed.

**URL Patterns:**
- If `url` exists: Uses the provided URL
- If `sender_name` exists: `{baseUrl}/profile/{sender_name}`
- If `sender_id` exists: `{baseUrl}/profile/{sender_id}`

**Examples:**
- `https://example.com/profile/johndoe`
- `https://example.com/profile/12345`

---

### 4. **Article** (`article`)
Redirects to the article page.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/posts/article/slug/my-article-title`
- `https://example.com/posts/article/12345`

---

### 5. **Post** (`post`)
Redirects to the post page.

**URL Patterns:**
- If `slug` exists and `isArticle === true`: `{baseUrl}/posts/article/slug/{slug}`
- If `slug` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === true`: `{baseUrl}/posts/article/{article_id}`
- If `article_id` or `articleId` exists and `isArticle === false`: `{baseUrl}/posts/post/{article_id}`
- If `url` exists: Uses the provided URL

**Examples:**
- `https://example.com/posts/post/12345`

---

### 6. **Podcast** (`podcast`)
Redirects to the podcast detail page.

**URL Patterns:**
- If `url` exists: Uses the provided URL
- If `podcastId` or `podcast_id` exists: `{baseUrl}/podcast/{podcastId}`

**Examples:**
- `https://example.com/podcast/12345`

---

### 7. **Publication / Stream** (`publication`, `stream`)
Redirects to the stream detail page.

**URL Patterns:**
- If `url` exists: Uses the provided URL
- If `streamId` or `stream_id` exists: `{baseUrl}/stream/{streamId}`
- If `publicationId` exists: `{baseUrl}/stream/{publicationId}`
- If `article_id` exists: `{baseUrl}/stream/{article_id}`

**Examples:**
- `https://example.com/stream/12345`

---

### 8. **Publication Article** (`publication-article`)
Redirects to the article that was added to a publication/stream.

**URL Patterns:**
- If `slug` exists: `{baseUrl}/posts/article/slug/{slug}`
- If `article_id` or `articleId` exists: `{baseUrl}/posts/article/{article_id}`

**Examples:**
- `https://example.com/posts/article/slug/my-article`
- `https://example.com/posts/article/12345`

---

## Fallback Behavior

If no specific redirect can be determined from the notification data, the default fallback is:

**URL:** `{baseUrl}/notifications`

**Example:**
- `https://example.com/notifications`

---

## Data Field Priority

When multiple data fields are available, the service worker uses the following priority order:

### For Articles/Posts:
1. `slug` (if available)
2. `article_id` or `articleId`
3. `url` (fallback)

### For Podcasts:
1. `podcastId` or `podcast_id`
2. `url` (fallback)

### For Streams/Publications:
1. `url` (if available)
2. `streamId` or `stream_id`
3. `publicationId`
4. `article_id` (only for publication type)

### For Profiles:
1. `url` (if available)
2. `sender_name`
3. `sender_id`

---

## Notes

- All URLs are relative paths starting with `/`
- Query parameters (like `?action=follow` or `?comment=123`) are appended when applicable
- The `isArticle` field determines whether content should route to `/posts/article/` or `/posts/post/`
- If a `url` field exists in the notification data, it takes precedence over constructed URLs
- The service worker ensures URLs don't have double slashes (`//`) and always start with `/`

