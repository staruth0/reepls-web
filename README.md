# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

Subscribe or unsubscribe from a publication. Publication owners are automatically subscribed and cannot manually toggle their subscription.

# Toggle subscription for a publication (Subscribe/Unsubscribe)
# POST /api-v1/publications/:publication_id/subscribe
POST {{baseUrl}}/publications/68aa4185a3377a93801dcea7/subscribe

Retrieves user's subscribed publications with pagination and detailed publication information.
# Get user's subscribed publications with pagination
# GET /api-v1/publications/me/subscriptions
GET {{baseUrl}}/publications/me/subscriptions?page=1&limit=10&sortBy=createdAt:desc

Retrieves subscribers of a specific publication (owner only access control).
# Get subscribers of a specific publication
# GET /api-v1/publications/:publication_id/subscribers  
GET{{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/subscribers?page=1&limit=10&sortBy=subscribedAt:desc

The collaboration system allows publications to have multiple contributors with different permission levels and automatic subscription management.
Permission Levels

-   Full Access: Can manage collaborators, edit publication settings, create/edit articles
-   Edit Access: Can create/edit articles, view analytics

1. Add Collaborator
Adds a collaborator to a publication with automatic subscription.
# Add a collaborator to a publication
# POST /api-v1/publications/:publication_id/collaborators
POST {{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/collaborators

Retrieves list of publication collaborators.
# Get list of publication collaborators with pagination and sorting
# GET /api-v1/publications/:publication_id/collaborators
GET {{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/collaborators?page=1&limit=10&sortBy=addedAt:desc


Updates collaborator permissions (owner only).
# Update collaborator permissions (Owner only)
# PATCH /api-v1/publications/:publication_id/collaborators/:collaborator_id
PATCH {{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/collaborators/68a78d94dc0b7eec46050acd

Allows a collaborator to leave a publication (self-removal).
# Leave collaboration (Self-removal)
# DELETE /api-v1/publications/:publication_id/collaborators/self
DELETE {{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/collaborators/self

Removes a collaborator from publication (owner only).
# Remove a collaborator from publication (Owner only)
# DELETE /api-v1/publications/:publication_id/collaborators/:collaborator_id
DELETE {{baseUrl}}/publications/68a786af3e0ecd6fc4e895e3/collaborators/687420d28a4d8df6fc4d10

Retrieves all publications where the user is a collaborator.
# Get my collaborative publications - Default pagination
# GET /api-v1/publications/my-publications
GET {{baseUrl}}/publications/my-publications
