const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, deleteMovie, createMovie } = require('../controllers/cards');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
  }),
}),
createMovie);

router.delete('/movies/:movieId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}),
deleteMovie);

module.exports = router;
