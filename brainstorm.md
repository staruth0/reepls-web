TODO: server connection, cloudinary,

- Recommended user and other recomended items have duplicates
- Comment with replies showing 0 reply count, comment with no replies showing >0 replies
- Find way to extract the actual error message from the backend not the generic axios error in react-query
- Inplace solution for empty id; just return an empty array but this whould be a temporary solution
- Too many requests(eg AuthorSuggestions)

- Popup when token expires (This should not happen regurlaly - current keeps trying to refresh token and is stuck and freezes the app)

useUser, subscribe + listen to authState,

===============================================

- Only see more if theere is more
- You dont need a toast for every success or error; just a few strategically placed ones

- Basic validation: comment should not be empty, comment should not be more than 255 characters,
- Comments should have see more and see less
- add profanity checking on frontend

- what shows on feed is recommended articles not all articles
- once user has viewed, it should not show in recommended articles or at least show with lower priority

- some data should be packaged from backend in one eg article data(article_data, ...reactions, ...comments,)
- loading icon

- group comments by author before rendering
- Refreshing not working well or something because requests keep failing
- Distinguish clearly btween what anonymous users can do and what logged in users can do

- if token refresh fails, redirect to login

- Way to extract the actual words from the html content so the TTS can read it

- Auto reize and compress images

Some Tasks for everyone:

-Implement a simple profanity filter with this package: https://www.npmjs.com/package/obscenity and reject post creation as needed based on the content profanity
-Put together the infrastructure for TTS with google cloud api but dont integrate it with in the service yet; the api will be provided soon for testing

Do cleanup: That means to go throughtout the site and remove the goffy things that were put there in development: for example,
-remove _unncessary_ console logs,
-change things like placeholders to appropariate ones,
-displaying the appropriate messages for example login failed because of incorrect password not saying eror 404etc,

- Adding default views when content is empty; for example, when there are no posts, when there are no comments, when there are no saved posts, nothing in the following feed, etc

Clean up the frontend: There is still a lot of problematic inconsistencies in the frontend: for example,
-the fonts for the text vs the titles are not showing as the design stipulates,
-some shadows are not applied such as the signin button in dark mode,
-the text colors are not properly applied sometimes like profile page text in dark mode, the feed page in dark mode as well,

- the input to collect the username has still not been implmentedyou have still no
- the profile page behaves oposite of what I expect: when you click on profile button to go to _YOUR_ profile page, it should goto profile/ and when you click on other user's profile button it should goto profile/otheruser'susername but currently it is the other way around
- States shopuld be updated properly: when i click on follwoing, it should show the 'following or unfollow' if it successfully follows, after saving should go to saved, etc
- i see lots of failing requests: fetching the user profile sometimes, reactions failing, commenting failing,
- The loading component being used is not good(i meaning like for posting, sending comment); use an icon or a proper spinner
- React on comment has not been implemented
- I should be able to close the comment box after posting a comment/opening it to read comments
- When i click to comment, the other comments should automatically load and show up
- We have to start thinking about the scrolling situation for the right sidebar/communiques
- on feed page some things show over the sidebar

Things I will do:

- Style the media viewer to look better
- Implement storage of media to cloudinary
- Complete the creation and viewing of posts

Final Ui

- As Fabrice mentioned, continue working on the admin dashboard

Modal, Dialog, Popover, Tooltip, Tabs, Slider,
Alerts and Toasts

-Reactions + confeti/indicaion

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
