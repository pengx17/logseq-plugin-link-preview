import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export function defineWebComponent() {
  @customElement("link-preview")
  class LinkPreviewCard extends LitElement {
    res: any;
    async connectedCallback() {
      this.res = await (await fetch(this.innerHTML.trim())).json();
      console.log(this.res);
      this.requestUpdate();
    }

    render() {
      return html`<pre>
${this.res ? JSON.stringify(this.res, null, 2) : "loading"}</pre
      >`;
    }
  }
}
