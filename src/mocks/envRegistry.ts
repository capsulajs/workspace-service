export const envRegistry = {
  develop: {
    services: [
      {
        serviceName: 'ParrotService',
        url: 'http://accessPoint/dev/ParrotService',
        methods: {
          repeat: {
            asyncModel: 'RequestResponse',
          },
        },
      },
      {
        serviceName: 'GreetingService',
        url: 'http://accessPoint/dev/GreetingService',
        methods: {
          hello: {
            asyncModel: 'RequestResponse',
          },
          helloToParrot: {
            asyncModel: 'RequestResponse',
          },
          helloToCount: {
            asyncModel: 'RequestStream',
          },
        },
      },
    ],
  },
  master: {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/master/service1',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/master/service2',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
          myTestMethod2: {
            asyncModel: 'RequestStream',
          },
        },
      },
    ],
  },
  'tag-1': {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/tag-1/service1',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-1/service2',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
          myTestMethod2: {
            asyncModel: 'RequestStream',
          },
        },
      },
    ],
  },
  'tag-2': {
    services: [
      {
        serviceName: 'service1',
        url: 'http://accessPoint/tag-2/service1',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
        },
      },
      {
        serviceName: 'service2',
        url: 'http://accessPoint/tag-2/service2',
        methods: {
          myTestMethod1: {
            asyncModel: 'RequestResponse',
          },
          myTestMethod2: {
            asyncModel: 'RequestStream',
          },
          myTestMethod42: {
            asyncModel: 'RequestResponse',
          },
        },
      },
    ],
  },
};
