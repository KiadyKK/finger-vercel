const mongoose = require("mongoose");

const Personnel = mongoose.model(
  "personnel",
  new mongoose.Schema({
    nom: String,
    prenom: String,
    finger: Number,
  })
);

module.exports = Personnel;
