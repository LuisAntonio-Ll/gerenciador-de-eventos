const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Event Manager API',
    description: 'API RESTful para gestão de eventos com limite de vagas e controle de inscrições.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [{ name: 'Events', description: 'Eventos e inscrições' }],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./eventRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
