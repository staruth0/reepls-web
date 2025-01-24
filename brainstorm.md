Modal, Dialog, Popover, Tooltip, Tabs, Slider,
Alerts and Toasts

- react-hot-toast or react-toastify
- sweetalert2 or

# To env

- API_URL
- CLOUDINARY_URL
- CLOUDINARY_KEY
- CLOUDINARY_SECRET
- CLOUDINARY_PRESET
- CLOUDINARY_CLOUD_NAME

npm i @cloudinary/url-gen @cloudinary/react

uninstall: editorjs, radix-ui,

Problemss

- Check if online
- Load comments page by page

- Create Post Pop Over has a slight border radius problem (check in dark mode)
- There might be possibility fo xss attacks via editor????
- Alert for everything: account exits with email already in use,
- Should sideba r show when visiting other users [page?]

- Profile page and link disabled if not logged in

Do Next

- Fix the editor
- Be able to type and view drafts
- Connect to storage/ Setup storage
- Clean up styling
- Cleanup Layouts: Left Side bar | Top bar and then content | Right top barand its content
  -On upload of media, link should be persisted in case it needs to be deleted

Small

- https://reactjs-tiptap-editor.vercel.app/guide/getting-started.html -https://templates.tiptap.dev/hzQHLtDMMD
- Relative position of the editor (check css) so that it does not gover navbar means that we cannot see the + and move block commands
- Edtior doaways: bubble menu, toolbar, the + & move, image/vid dialog (hidetoolbar),

-On click the communique expand and can be read; click another and this one closes

- clean adding thumnail image

- Find way to ovveride shadcn styles in editor
- Reactions should show on click
- voice stuff should be grouped
- When the profile uid is missing, it means we are on the profile page of the current user
  (Allows for options like edit profile, change password, etc)
- When the profile uid is present, it means we are on the profile page of another user

- Only show reactions on click of react button
- Read alout in app language chosen at signup
- Reduce height pop over items
- Add cognitive mode icons
- Emoji picker dark mode
- Should display multiple media with slider to show
- See more, see less ---colored? bolded?
- Replace icons images with icon pack icons
- auth and other layoust moved accordinaly

fabricekongnyuy2@gmail.com
Ilovemydreams1#

===== Notes while working ==========

The same layout is usable for

- Feed
- Profile
- Notification
- write article
- View article

Todo

- App-wide color and other settings management
- Editor problems
- Handling themes in standard way
- No incode color&&font size setting

- Should not show edit and other options on profile page of other user
- Capture username input

Fixes

- Debounce Editor updates
- Support for multiple languages
- Support for multiple themes (and should read from system)

-

Animated icons:

- https://icons.pqoqubbw.dev
- https://react.useanimations.com/

Editor Considerations

- use pure TipTap (if can find their immplementation)
- use Novel
- use reactjs-tiptap-editor library

What do I want to achive for the editor?
What is provided by each options?

https://www.radix-ui.com/primitives/docs/components/tooltip

Adding:

- Radix Ui
- Tailwind css

Refs:

- https://tailwindui.com/components/application-ui/overlays/modal-dialogs
- Popover: https://dev.to/said7388/how-to-create-a-popover-using-tailwind-css-13kj
- Tabs: https://devsimplified.hashnode.dev/tabs-in-reactjs-with-slider-animation

Editor command addtions

- search and replace
- emoji keyboard
- equation?
  Mobile
- Add image and video
- Fix link

To do

- Add Error boundary to app
-
