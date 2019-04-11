import 'document-register-element';
import { Workspace as WorkspaceInterface } from '../src/api/Workspace';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="grid"></div>
  `;
});
