import 'document-register-element';
import { Workspace as WorkspaceInterface } from '../src/api/Workspace';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="root">
      <div id="grid">
        <div id="catalog"></div>
      </div>
    </div>
  `;
});
