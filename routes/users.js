const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getProfile } = require('../controllers/users');

router.get('/users/me', getProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
