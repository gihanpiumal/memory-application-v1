var jwt = require("jsonwebtoken");
require("dotenv").config();

function authService(req, res, next) {
  if (!process.env.authenticateState) {
    next();
    return;
  }
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.secretKey, function (err, decoded) {
    if (err)
      return res
        .status(403)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.userId = decoded._id;

    next();
  });
}

module.exports = authService;
