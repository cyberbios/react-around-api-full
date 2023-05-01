module.exports.testLink = (link) => {
  const regEx = /^(https?:\/\/)([\w\-._~:/?%#[\]@!$&'()*+,;=]+)/;
  return regEx.test(link);
};
