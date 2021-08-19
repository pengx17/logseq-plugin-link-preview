# Logseq Plugin Link Preview

A simple plugin to show basic link information on hovering external links in Logseq.

## Disclaimer 🚨

- This plugin WILL send network requests to the author's server https://pengx17.vercel.app/. If you feel insecure about it, please do not use it.
- The link preview does not always work. e.g., internal links inside of your private network.

## Demo

![](./demo.gif)

## TODO

- [ ] Adapt for dark theme
- [ ] An toggle to let the user change the link to link card in the document.

## How does this plugin work?

It will register `mouseenter` and `mouseleave` events on all external links in the main document of Logseq. Note, in this step this plugin uses a unsafe `top` context of the main document, which might not work in the future.

In the listener, the plugin will extract the `href` attribute of the link and send a request to an API server to get the link information (the OpenGraph metadata).

Once the api returns with the link metadata (e.g., title, description, image), the plugin will

- render them in the plugin iframe
- move its position to the hovering link
