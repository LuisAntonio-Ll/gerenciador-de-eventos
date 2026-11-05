const sequelize = require('./database');
const app = require('./app');

const PORT = 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });
