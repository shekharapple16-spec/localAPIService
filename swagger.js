import swaggerJSDoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scheduling Group API',
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ]
  },
  apis: ['./server.js']
});

export default swaggerSpec;
