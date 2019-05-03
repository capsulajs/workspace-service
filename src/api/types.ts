interface Tab {
  id: string;
  name: string;
  content: HTMLElement;
}

interface Node {
  id: string;
  flex: number;
  type: string;
}

interface Element extends Node {
  type: 'element';
  activeTabIndex: number;
  tabs: Tab[];
}

interface Container extends Node {
  type: 'container';
  orientation: 'horizontal' | 'vertical';
  nodes: [Layout, Layout];
}

export type Layout = Container | Element;
