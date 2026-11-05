const express = require('express');
const { Event, Registration } = require('./models');
const sequelize = require('./database');
const { validateEvent, validateRegistration } = require('./middlewares/validation');

const router = express.Router();

// POST /events - cria um novo evento
router.post('/events', validateEvent, async (req, res) => {
  /*
    #swagger.tags = ['Events']
    #swagger.description = 'Cria um novo evento com limite de vagas.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do evento',
      required: true,
      schema: {
        title: 'Workshop Node',
        date: '2026-11-10T19:00:00Z',
        capacity: 2
      }
    }
    #swagger.responses[201] = { description: 'Evento criado com sucesso.' }
    #swagger.responses[400] = { description: 'Dados inválidos.' }
  */
  try {
    const { title, date, capacity } = req.body;
    const event = await Event.create({ title, date, capacity });
    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao criar evento', error: err.message });
  }
});

// GET /events - lista eventos com a contagem de inscrições
router.get('/events', async (req, res) => {
  /*
    #swagger.tags = ['Events']
    #swagger.description = 'Lista todos os eventos com a contagem de inscrições (registrationsCount).'
    #swagger.responses[200] = { description: 'Lista de eventos.' }
  */
  try {
    const events = await Event.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Registrations WHERE Registrations.eventId = Event.id)'
            ),
            'registrationsCount',
          ],
        ],
      },
      order: [['date', 'ASC']],
    });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao listar eventos', error: err.message });
  }
});

// POST /events/:id/register - inscreve um participante
router.post('/events/:id/register', validateRegistration, async (req, res) => {
  /*
    #swagger.tags = ['Events']
    #swagger.description = 'Registra um participante em um evento, respeitando o limite de vagas.'
    #swagger.parameters['id'] = { in: 'path', description: 'ID do evento', required: true, type: 'integer' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do participante',
      required: true,
      schema: {
        participantName: 'Maria',
        email: 'maria@email.com'
      }
    }
    #swagger.responses[201] = { description: 'Inscrição realizada.' }
    #swagger.responses[400] = { description: 'Dados inválidos.' }
    #swagger.responses[403] = { description: 'Evento lotado.' }
    #swagger.responses[404] = { description: 'Evento não encontrado.' }
  */
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    const count = await Registration.count({ where: { eventId: event.id } });
    if (count >= event.capacity) {
      return res.status(403).json({ message: 'Evento lotado' });
    }

    const { participantName, email } = req.body;
    const registration = await Registration.create({
      participantName,
      email,
      eventId: event.id,
    });

    return res.status(201).json(registration);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao registrar participante', error: err.message });
  }
});

module.exports = router;
