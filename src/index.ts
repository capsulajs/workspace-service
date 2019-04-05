import 'babel-polyfill';
import { Workspace } from './Workspace';
import { envRegistry } from './mocks/envRegistry';
import { workspaceConfig } from './mocks/workspaceConfig';

const token = 'localhost:1234';

localStorage.setItem(`${token}.environmentRegistry`, JSON.stringify(envRegistry));

(window as any).workspace = new Workspace({ token, config: workspaceConfig });
const workspace = (window as any).workspace;

workspace.start().catch((e: any) => { throw new Error(e)});
