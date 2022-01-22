const pool = require("../db/index");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const { createUserValidation } = require("../validation");

module.exports.check_signup_post = async (req, res) => {
  //validate informations
  const { error } = createUserValidation(req.body);

  if (error) {
    return res.json({ err: error.details[0].message });
  }

  const { email } = req.body;

  try {
    // check if user exists (if exists throw err)
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.json({ emailExists: true });
    }

    res.status(201).json({ emailExists: false });
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    // bcrypt the users passw
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter the new user inside db
    const newUser = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",
      [email, bcryptPassword]
    );

    //create token
    const token = jwtGenerator(newUser.rows[0].user_id);

    const sendUser = {
      user_id: newUser.rows[0].user_id,
      email: newUser.rows[0].email,
    };

    res.status(201).json({ token, user: sendUser });
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports.check_login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const person = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (person.rows.length === 0) {
      return res.status(401).json({ err: "Email or Pasword is Wrong" });
    }

    const validPassword = await bcrypt.compare(
      password,
      person.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({ err: "Email or Pasword is Wrong" });
    }

    return res.json({ okey: true });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("server error");
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const person = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    //create token
    const token = jwtGenerator(person.rows[0]);

    const user = {
      user_id: person.rows[0].user_id,
      email: person.rows[0].email,
    };

    return res.json({ token, user });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("server error");
  }
};

module.exports.verifyUser_post = (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
