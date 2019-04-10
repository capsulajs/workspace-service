import 'document-register-element';

beforeEach(() => {
  jest.mock(
    '/home/dmytrohryshchenko/projects/workspace-service/node_modules/typeface-montserrat/index.css',
    () => ({})
  );
  document.body.innerHTML = '<div id="root"></div>';
});
