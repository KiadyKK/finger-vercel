const mongoose = require("mongoose");

const Finger = mongoose.model(
  "finger",
  new mongoose.Schema({
    nom: String,
    prenom: String,
    jour: String,
    matin: String,
    midi: String,
  })
);

module.exports = Finger;
