require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const crypto = require('crypto'); // экспортируем crypto
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');

const app = express();
const { PORT = 3000 } = process.env;
const connection = (process.env.DB_CONNECTION_STRING);

app.use(cors());
app.options('*', cors());

const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex'); // приведём её к строке

console.log(randomString);

mongoose.connect(connection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', express.json());

app.use(requestLogger);

app.use(helmet());

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
