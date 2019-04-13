export default class Grid extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div class="selectors">
        <div id="env-dropdown"></div>
        <div id="method-catalog"></div>
      </div>
      <div id="logger"></div>
      <div id="request-form"></div>
    `;
  }
}
