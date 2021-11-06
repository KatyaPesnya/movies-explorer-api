const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(1).max(100),
    director: Joi.string().required().min(1).max(100),
    duration: Joi.number().required(),
    year: Joi.string().required().min(1).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image заполнено некорректно');
    }),
    nameRU: Joi.string().required().min(1).max(100),
    nameEN: Joi.string().required().min(1).max(100),
    movieId: Joi.number().required(),
  }),
}),
createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}),
deleteMovie);

module.exports = router;
