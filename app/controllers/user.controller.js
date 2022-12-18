const db = require("../models");

const Personnel = db.personnel;
const Presence = db.presence;

exports.addPersonnel = async(req, res) => {
  try {
    const personnel = new Personnel({
      nom: req.body.nom,
      prenom: req.body.prenom,
      finger: req.body.finger,
    })
    const data = await personnel.save(personnel)
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error)
  }
}

exports.findPersonnel = async(req, res) => {
  try {
    const data = await Personnel.find()
    res.send(data)
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while retrieving tutorials." });
    console.log(error)
  }
}

exports.findPresence = async(req, res) => {
  const convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("/");
  }
  try {
    const data = await Presence.find({jour: convert(req.query.date)})
    res.send(data)
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occurred while retrieving tutorials." });
    console.log(error)
  }
}