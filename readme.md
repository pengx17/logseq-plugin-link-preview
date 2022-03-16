# Logseq Plugin Link Preview

A simple plugin to show basic link information (based on [OpenGraph Protocol](https://ogp.me/)) for external links in Logseq.

By default when it is enabled, when you hovering any external link in Logseq, it will show the link preview.
Also this plugin will register a `Convert to Link Card` command for you to convert the link to a link card.

![](hover-demo.png)

## Features

- Show link preview when hovering any external link in Logseq
- Convert the link to a link card when you use the `Convert to Link Card` command
- Cache the results locally
- Light & dark theme

## Demo

![](./demo.gif)

## How does this plugin work?

There are two modes of this plugin:
- Hovering mode
- Macro mode

The two modes are working very differently, but they codes are mostly shared.

### Hovering Mode

It will register `mouseenter` and `mouseleave` events on all external links in the main document of Logseq. Note, in this step this plugin uses a unsafe `top` context of the main document, which might not work in the future.

In the listener, the plugin will extract the `href` attribute of the link and send a request to an API server to get the link information (the OpenGraph metadata).

Once the api returns with the link metadata (e.g., title, description, image), the plugin will

- render them in the plugin iframe
- resize the iframe and move its position to the hovering link

### Macro Mode

Typically, user will use slash command to create a custom renderer Marco `:linkpreview` with the URL as the argument

```html
{{renderer :linkpreview,https://google.com}}
```

When it is rendered, the `logseq.App.onMacroRendererSlotted` hook will fetch the link information from the API server and render it with `ReactDomServer.renderToString` method into the slot. The plugin will register the styles into the global context.
