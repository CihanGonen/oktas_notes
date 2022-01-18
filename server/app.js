const express = require("express");
require("dotenv").config();
var cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const generalRoutes = require("./routes/generalRoutes");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

app.use(generalRoutes);
app.use(authRoutes);
