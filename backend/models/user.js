const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { testLink } = require('../constants/testLink');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return testLink(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: { validator: isEmail, message: 'Email is not valid.' },
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
