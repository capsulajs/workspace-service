export default class Grid extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div id="env-dropdown"></div>
      <div id="method-catalog"></div>
      <div id="request-form"></div>
    `;
  }
}
