require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const httpStatusCodes = require('../utils/httpStatusCodes');
const ApiError = require('../utils/ApiError');

const { JWT_SECRET = 'test' } = process.env;

// get current user
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new ApiError('User id not found.', httpStatusCodes.NOT_FOUND);
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// get all users
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      next(
        new ApiError(
          'An error has occurred on the server.',
          httpStatusCodes.INTERNAL_SERVER
        )
      )
    );
};
// get user by ID
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(`User with id: ${req.params.id} not found.`);
      error.statusCode = httpStatusCodes.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError('User not found', httpStatusCodes.NOT_FOUND));
      } else if (err.name === 'CastError') {
        next(new ApiError('Bad Request', httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            'An error has occurred on the server.',
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};
// Create new user
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          const userObject = user.toObject();
          // Delete the password field from the object
          delete userObject.password;
          res.send({ data: userObject });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ApiError('Not unique email', httpStatusCodes.UNIQUE_EMAIL)
            );
          } else if (err.name === 'ValidationError') {
            next(new ApiError('Invalid Data', httpStatusCodes.BAD_REQUEST));
          } else {
            next(
              new ApiError(
                'An error has occurred on the server',
                httpStatusCodes.INTERNAL_SERVER
              )
            );
          }
        });
    })
    .catch(() => {
      next(new ApiError('Invalid Data', httpStatusCodes.BAD_REQUEST));
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new ApiError(
        'invalid data passed to the methods for updating a user',
        httpStatusCodes.NOT_FOUND
      );
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError('User not found', httpStatusCodes.NOT_FOUND));
      } else if (err.name === 'ValidationError') {
        next(new ApiError('Bad Request', httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            'An error has occurred on the server.',
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new ApiError(
        'invalid data passed to the methods for updating a user',
        httpStatusCodes.NOT_FOUND
      );
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === httpStatusCodes.NOT_FOUND) {
        next(new ApiError('User not found', httpStatusCodes.NOT_FOUND));
      } else if (err.name === 'CastError') {
        next(new ApiError('Bad Request', httpStatusCodes.BAD_REQUEST));
      } else {
        next(
          new ApiError(
            'An error has occurred on the server.',
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      }
    });
};

// login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(
          new ApiError('User not unauthorized', httpStatusCodes.UNAUTHORIZED)
        );
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          throw new ApiError(
            'User not unauthorized',
            httpStatusCodes.UNAUTHORIZED
          );
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.send({ token });
      });
    })
    .catch(next);
};
