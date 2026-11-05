const express = require('express');
const swaggerUi = require('swagger-ui-express');
require('./models'); // carrega modelos e relacionamentos
const eventRoutes = require('./eventRoutes');

const app = express();

app.use(express.json());
app.use(eventRoutes);

// Documentação interativa (gerada com: npm run swagger)
try {
  const swaggerFile = require('./swagger_output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} catch (err) {
  console.warn('swagger_output.json não encontrado. Rode "npm run swagger" para gerá-lo.');
}

// Apenas exporta o app: quem inicia a porta é o server.js
module.exports = app;
