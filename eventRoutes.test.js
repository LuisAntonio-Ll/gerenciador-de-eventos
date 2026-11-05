const request = require('supertest');

// Isolamento do banco: nenhum acesso real ao SQLite/Sequelize nos testes
jest.mock('./database', () => ({
  literal: jest.fn((sql) => sql),
  sync: jest.fn(),
}));

jest.mock('./models', () => ({
  Event: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Registration: {
    count: jest.fn(),
    create: jest.fn(),
  },
}));

const app = require('./app');
const { Event, Registration } = require('./models');

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /events', () => {
  it('deve listar os eventos e retornar status 200', async () => {
    // Arrange
    const eventos = [
      { id: 1, title: 'Workshop Node', capacity: 2, registrationsCount: 0 },
    ];
    Event.findAll.mockResolvedValue(eventos);

    // Act
    const response = await request(app).get('/events');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(eventos);
    expect(Event.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 500 se o banco falhar', async () => {
    // Arrange
    Event.findAll.mockRejectedValue(new Error('falha no banco'));

    // Act
    const response = await request(app).get('/events');

    // Assert
    expect(response.statusCode).toBe(500);
  });
});

describe('POST /events', () => {
  it('deve criar um evento válido e retornar status 201', async () => {
    // Arrange
    const payload = {
      title: 'Workshop Node',
      date: '2026-11-10T19:00:00Z',
      capacity: 2,
    };
    Event.create.mockResolvedValue({ id: 1, ...payload });

    // Act
    const response = await request(app).post('/events').send(payload);

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ id: 1, title: 'Workshop Node', capacity: 2 });
    expect(Event.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 400 se a capacity não for informada', async () => {
    // Arrange
    const payload = { title: 'Workshop Node', date: '2026-11-10T19:00:00Z' };

    // Act
    const response = await request(app).post('/events').send(payload);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(Event.create).not.toHaveBeenCalled();
  });
});

describe('POST /events/:id/register', () => {
  const participante = { participantName: 'Maria', email: 'maria@email.com' };

  it('deve retornar 403 quando o evento já atingiu a capacidade máxima', async () => {
    // Arrange
    Event.findByPk.mockResolvedValue({ id: 1, capacity: 2 });
    Registration.count.mockResolvedValue(2);

    // Act
    const response = await request(app).post('/events/1/register').send(participante);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toMatch(/lotado/i);
    expect(Registration.create).not.toHaveBeenCalled();
  });

  it('deve registrar o participante e retornar 201 quando há vaga', async () => {
    // Arrange
    Event.findByPk.mockResolvedValue({ id: 1, capacity: 2 });
    Registration.count.mockResolvedValue(1);
    Registration.create.mockResolvedValue({ id: 10, eventId: 1, ...participante });

    // Act
    const response = await request(app).post('/events/1/register').send(participante);

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({ eventId: 1, participantName: 'Maria' });
  });

  it('deve retornar 404 quando o evento não existe', async () => {
    // Arrange
    Event.findByPk.mockResolvedValue(null);

    // Act
    const response = await request(app).post('/events/999/register').send(participante);

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('deve retornar 400 quando o e-mail é inválido', async () => {
    // Arrange
    const payload = { participantName: 'Maria', email: 'email-invalido' };

    // Act
    const response = await request(app).post('/events/1/register').send(payload);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(Event.findByPk).not.toHaveBeenCalled();
  });
});

describe('GET /api-docs', () => {
  it('deve servir o painel do Swagger', async () => {
    // Act
    const response = await request(app).get('/api-docs/');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/swagger/i);
  });
});
