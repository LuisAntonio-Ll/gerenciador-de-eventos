const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().iso().required(),
  capacity: Joi.number().integer().greater(0).required(),
});

const registrationSchema = Joi.object({
  participantName: Joi.string().required(),
  email: Joi.string().email().required(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Dados inválidos',
      details: error.details.map((d) => d.message),
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateEvent: validate(eventSchema),
  validateRegistration: validate(registrationSchema),
};
