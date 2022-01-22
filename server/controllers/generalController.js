const pool = require("../db/index");
const nodemailer = require("nodemailer");

module.exports.note_post = async (req, res) => {
  const { baslik, icerik, user_id } = req.body;

  try {
    // enter the new note inside db
    const newNote = await pool.query(
      "INSERT INTO notes (baslik,icerik,user_id) VALUES ($1,$2,$3) RETURNING *",
      [baslik, icerik, user_id]
    );

    res.status(201).json(newNote.rows);
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
