const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.status(403).json("Yetkiniz Yok");
    }

    const payload = jwt.verify(jwtToken, process.env.SECRET_TOKEN);

    req.user = {
      kullanici_id: payload.kullanici_id,
      name: payload.name,
      baskanlik_id: payload.baskanlik_id,
      yetki_id: payload.yetki_id,
    };
  } catch (err) {
    console.log(err.message);
    return res.status(403).json("Yetkiniz Yok");
  }

  next();
};
