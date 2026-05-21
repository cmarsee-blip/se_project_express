const escape = require("escape-html");

function sanitizeInput(input) {
  return escape(input);
}

module.exports = { sanitizeInput };
