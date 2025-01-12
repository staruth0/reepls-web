Steps:

1. Dont work on anything having to with Posting or aticles for now; I want tcontinue it but we have toget the layout right first
2. If you visit /test/feed, you will see how I am trying to bring everything together for the userlayout

The user layout will be used for

- Feed
- Profile
- Notification
- write article
- View article

The layout is just a grdi with 2 columns of 1fr and 5fr
NThe 1 fr is the sidebar and the 5fr is the content depending on the page
For example, the feed page will further divide the 5fr into 2 columns of 4fr and 1fr (the 4fr is the feed and the 1fr is the communique)(the styles might change but that is the idea)
The profile page will also divide the 5fr into 2 columns of 4fr and 1fr (where the 4fr is the profile and the 1fr is the settings)
.. and so on
I think notifications will not divide it but just use all of teh 5fr but we will see

I already have th userlayout so all you have to do is rearrange the components/PAGES to fit the layout (IE just changing from what we alreay have)

Finally, create a tabs component because it seems many pages need it
For example, feed page needs it for for you and following
profile page needs it for about, posts, articles,...
(I would say you should look online for working implemntation and adapt it e-https://devsimplified.hashnode.dev/tabs-in-reactjs-with-slider-animation
)

Also be careful with styling with sticky because it causes a lot of problems with creating and overlay component

===== Notes while working ==========

The same layout is usable for

- Feed
- Profile
- Notification
- write article
- View article

Left Side bar | Top bar and then content | Right top barand its content

currentlt have:
home container for feed and search
then another fopr create postx

Todo

- App-wide color and other settings management
- Editor problems
- Handling themes in standard way
- No incode color&&font size setting

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
