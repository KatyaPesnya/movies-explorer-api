const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const NotAuthError = require('../errors/not-auth-err');

const getMovies = (req, res, next) => {
  // const owner = req.user_id;
  Movie.find()
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((movie) => {
      if (owner.toString() !== owner) {
        next(new NotAuthError('Нет прав для удаления карточки'));
      } else {
        Movie.findByIdAndDelete(movieId)
          .then(() => {
            res.status(200).send(movie);
          });
      }
    })
    .catch(next);
};

module.exports = { getMovies, deleteMovie, createMovie };
