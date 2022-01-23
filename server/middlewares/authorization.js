const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    if (!jwtToken) {
      return res.status(403).json("Yetkiniz Yok");
    }

    const payload = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
    console.log(payload);
    req.user = {
      user_id: payload.user_id,
      email: payload.email,
    };
  } catch (err) {
    console.log(err.message);
    return res.status(403).json("Yetkiniz Yok");
  }

  next();
};
