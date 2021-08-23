const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const NotAuthError = require('../errors/not-auth-err');
const BadReqError = require('../errors/bad-req-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь с указанным id не найден')))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;

  User.findOneAndUpdate(
    { _id: id },
    { name, email },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const register = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('Такой пользователь уже зарегистрирован'));
        return;
      } if (!user) {
        next(new BadReqError('Не заполнены обязательные поля.'));
      }
    });
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,

      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new NotAuthError(`Необходима авторизация: ${err.message}`));
    });
};
module.exports = {
  getProfile,
  updateProfile,
  register,
  login,
};
