# Logseq Plugin Link Preview

A simple plugin to show basic link information on hovering external links in Logseq.

## Disclaimer 🚨

- This plugin WILL send network requests to the author's server https://logseq-plugin-link-preview.vercel.app/. If you feel insecure about it, please either do not use it, or deploy it yourself, which is explained in the next session.
- The link preview does not always work. e.g., internal links inside of your private network.

### Deploy your own backend

Due to some technical limitations (CORS), the link preview metadata could not work without a proxy server.
The easiest solution is to deploy your own backend to [Vercel](https://vercel.com/) using serverless functions:

- fork this plugin repository
- import your forked repository as a new project in Vercel
- configure it with `FRAMEWORK PRESET` to Other
- override `INSTALL COMMAND` in Build settings to `npm i pnpm -g && pnpm i`
- click deploy. After deploy is done, you can now replace the `https://logseq-plugin-link-preview.vercel.app/` with your own backend URL.

## Demo

![](./demo.gif)

## TODO

- [ ] Add docs about how to self-hosting the backend
- [ ] Adapt for dark theme
- [ ] An toggle to let the user change the link to link card in the document.

## How does this plugin work?

It will register `mouseenter` and `mouseleave` events on all external links in the main document of Logseq. Note, in this step this plugin uses a unsafe `top` context of the main document, which might not work in the future.

In the listener, the plugin will extract the `href` attribute of the link and send a request to an API server to get the link information (the OpenGraph metadata).

Once the api returns with the link metadata (e.g., title, description, image), the plugin will

- render them in the plugin iframe
- move its position to the hovering link
