/**
 * Layout service is responsible for each component to:
 * - fetch the correct props in relevant services
 * - render the component in the grid
 * - re-render the component when it's necessary (props changed)
 *
 */

export class Layout {
  private token: string;

  constructor({ token }: { token: string }) {
    this.token = token;
  }

  public render() {
    return new Promise((resolve, reject) => {
      Object.values(window.workspace.components()).forEach((component) => {
        document.querySelector(component.nodeSelector)!.appendChild(component.reference);
      });
      resolve();
    });
  }
}
