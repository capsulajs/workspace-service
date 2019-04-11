import { groupBy } from 'lodash';

export const mapServiceMethods = (methods) => {
  const serviceGroups = groupBy(methods, 'serviceName');
  const mapServiceMethods = (service) => ({
    id: service,
    name: service,
    children: serviceGroups[service].map(({ methodName }) => ({ id: methodName, name: methodName })),
  });

  return [
    {
      id: 'root',
      name: 'Services',
      children: Object.keys(serviceGroups).map(mapServiceMethods),
    },
  ];
};
