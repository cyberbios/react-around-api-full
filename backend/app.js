require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const httpStatusCodes = require('./utils/httpStatusCodes');
const ApiError = require('./utils/ApiError');
const { handleErrors } = require('./utils/handleErrors');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 100000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/aroundb');
const app = express();
app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.options('*', cors()); // enable requests for all routes
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cardsRouter);
app.use(usersRouter);
app.use((req, res, next) => {
  next(
    new ApiError('Requested resource not found.', httpStatusCodes.NOT_FOUND)
  );
});
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
