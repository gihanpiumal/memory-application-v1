const winston = require("winston");
const ApiResponse = require("../services/response_helper");

module.exports = function (err, req, res, next) {
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res
    .status(500)
    .send(
      ApiResponse.getError(
        "We were unable to process your request. Please try again in later."
      )
    );
};
