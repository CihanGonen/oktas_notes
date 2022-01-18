const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user) {
  const payload = {
    kullanici_id: user.kullanici_id,
    name: user.name,
    yetki_id: user.yetki_id,
    baskanlik_id: user.baskanlik_id,
  };
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
