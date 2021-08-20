const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, register } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
      .pattern(new RegExp('^[A-Za-z0-9]{8,30}$')),
    name: Joi.string().min(2).max(30),
  }),
}), register);

router.use(auth, usersRoutes);
router.use(auth, moviesRoutes);

router.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
