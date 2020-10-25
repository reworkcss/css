try {
  var fs = require("fs");
} catch (e) {
  var fs = null;
}

module.exports = function () {
  if (!fs) {
    throw Error(
      'Module "fs" not found. Source maps not supported. This could be because you\'re running in a browser.'
    );
  }

  return fs;
};
