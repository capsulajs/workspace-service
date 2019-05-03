import { RenderRequest } from './methods/render';
import { OnUpdateRequest } from './methods/on-update';

interface LayoutService {
  render(renderRequest: RenderRequest);
  onUpdate(onUpdateRequest: OnUpdateRequest);
}
