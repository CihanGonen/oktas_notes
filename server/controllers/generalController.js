const pool = require("../db/index");

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
