import { groupBy } from 'lodash';

export const mapServiceMethods = (methods) => {
  const serviceGroups = groupBy(methods, 'serviceName');
  const mapServiceMethod = (service) => ({
    id: 'root',
    name: service,
    children: serviceGroups[service].map(({ methodName }) => ({ id: service, name: methodName })),
  });

  return [
    {
      id: 'root',
      name: 'Services',
      children: Object.keys(serviceGroups).map(mapServiceMethod),
    },
  ];
};
