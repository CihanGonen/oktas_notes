const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
