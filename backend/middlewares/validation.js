const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(validateURL).required(),
  }),
});

const cardIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(24).max(24).required(),
  }),
});

const createUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const getUserSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().min(24).max(24).required(),
  }),
});

const updateUserSchema = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    })
    .min(1),
});

const updateAvatarSchema = celebrate({
  body: Joi.object().keys({ avatar: Joi.string().custom(validateURL) }),
});

module.exports = {
  createCardSchema,
  cardIdSchema,
  createUserSchema,
  loginSchema,
  getUserSchema,
  updateUserSchema,
  updateAvatarSchema,
};
