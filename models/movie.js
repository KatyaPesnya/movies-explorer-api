const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: { // ссылка на постер к фильму
    type: String,
    required: [true, "Поле 'link' должно быть заполнено."],
    validate: {
      validator: (v) => isURL(v),
      message: 'Ошибка валидации url адреса',
    },
  },
  trailer: { // ссылка на трейлер
    type: String,
    required: [true, "Поле 'link' должно быть заполнено."],
    validate: {
      validator: (v) => isURL(v),
      message: 'Ошибка валидации url адреса',
    },
  },
  thumbnail: { // миниатюрное изображение постера к фильму
    type: String,
    required: [true, "Поле 'link' должно быть заполнено."],
    validate: {
      validator: (v) => isURL(v),
      message: 'Ошибка валидации url адреса',
    },
  },
  owner: { // id пользователя
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
