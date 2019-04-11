import '@babel/polyfill';
import { Workspace } from './Workspace';
import { Workspace as WorkspaceInterface } from './api/Workspace';
import { envRegistry } from './mocks/envRegistry';
import { token } from './const';
import { workspaceConfig } from './mocks/workspaceConfig';

declare global {
  interface Window {
    workspace: WorkspaceInterface;
  }
}

localStorage.setItem(`${token}.environmentRegistry`, JSON.stringify(envRegistry));

const workspace = new Workspace({ token, config: workspaceConfig });
window.workspace = workspace;

workspace
  .start({ token })
  .then(() => {
    workspace
      .services({})
      .then((data) => console.log('data', data))
      .catch((error) => console.log('error', error));
  })
  .catch((error) => {
    throw new Error(error);
  });
