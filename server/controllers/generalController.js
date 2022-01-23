const pool = require("../db/index");
const nodemailer = require("nodemailer");

const {
  doSomethingSpecial,
  doSomethingSpecialReverse,
} = require("../somethingSpecial.js");

module.exports.note_post = async (req, res) => {
  const { baslik, not, userId } = req.body;

  try {
    //check if başlık exists
    const notes = await pool.query(
      "SELECT * FROM notes WHERE baslik=$1 AND user_id=$2",
      [baslik, userId]
    );

    if (notes.rows.length !== 0) {
      return res.json({ notExists: true });
    }

    // enter the new note inside db
    const newNote = await pool.query(
      "INSERT INTO notes (baslik,icerik,user_id) VALUES ($1,$2,$3) RETURNING *",
      [baslik, not, userId]
    );

    const date = await pool.query("SELECT * from notes WHERE baslik=$1", [
      baslik,
    ]);

    const cryptedNote = doSomethingSpecial(date.rows[0].created_at, not);

    const updatedNote = await pool.query(
      "UPDATE notes SET icerik=$1 WHERE baslik=$2 RETURNING *",
      [cryptedNote, baslik]
    );

    res.status(201).json(updatedNote.rows);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports.note_get = async (req, res) => {
  const { userId } = req.params;
  try {
    // enter the new note inside db
    const notes = await pool.query("SELECT * FROM notes where user_id=$1", [
      userId,
    ]);

    for (let i = 0; i < notes.rows.length; i++) {
      notes.rows[i].icerik = doSomethingSpecialReverse(
        notes.rows[i].icerik,
        notes.rows[i].created_at
      );
    }

    res.status(201).json(notes.rows);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports.verifEmail_post = async (req, res) => {
  console.log(req.body);
  let { code, to } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let mailOptions = {
    from: "9oktas@gmail.com",
    to: to,
    subject: "Your 1 Time Confirmation Code",
    text: "Use this code to log in",
    html: `<h2>Use this code to log in</h2><p>${code}</p>`,
  };
  try {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        res.json({ status: "fail" });
      }
      res.json({ status: "success" });
    });
  } catch (err) {
    return err.message;
  }
};
