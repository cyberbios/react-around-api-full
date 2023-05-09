require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./constants/rateLimit');
const httpStatusCodes = require('./constants/httpStatusCodes');
const ApiError = require('./constants/ApiError');
const { handleErrors } = require('./constants/handleErrors');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(usersRouter);
app.use(cardsRouter);
app.use((req, res, next) => {
  next(new ApiError('Request resource not found.', httpStatusCodes.NOT_FOUND));
});
app.use(errorLogger);
app.use(errors);
app.use(handleErrors);
app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
