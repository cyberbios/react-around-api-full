const mongoose = require('mongoose');
const { testLink } = require('../utils/testLink');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, // the minimum length of the name is 2 characters
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return testLink(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Object,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
