const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

const Personnel = db.personnel;
const Presence = db.presence;

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.use(express.static(__dirname + '/app/views'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname)));

app.get('/print', async(req, res) => {
  const convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("/");
  }

  // const date = new Date(new Date().setHours(new Date().getHours() + 3))
  const date = new Date()
  const pers = await Personnel.findOne({ finger: parseInt(req.query.finger) })
  const count = await Presence.countDocuments({ nom: pers.nom, prenom: pers.prenom, jour: convert(date) })

  //Fonction pour sauvegarder la présence
  const newpresence = async (pers, matin) => {
    const presence = new Presence({
      nom: pers.nom,
      prenom: pers.prenom,
      jour: convert(matin),
      matin: new Date(matin).toISOString(),
      midi: ''
    })
    try {
      const data = await presence.save(presence)
      res.send('true')
    } catch (err) {
      console.log(err)
      res.send('false')
    }
  }

  //Fonction pour vérifier l'heure midi
  const checkHeureMidi = async (pers, midi) => {
    var cond = {nom: pers.nom, prenom: pers.prenom, jour: convert(midi), midi: ''};
    const count = await Presence.countDocuments(cond)
    if (count == '1') {
      updateSortie(cond, midi)
    } else if (count == '0') {
      newpresence(pers, midi)
    }
  }
  
  //Fonction pour modifier l'heure midi
  const updateSortie = async (cond, midi) => {
    try {
      const value = {midi: new Date(midi).toISOString()}
      const result = await Presence.updateOne(cond, value)
      res.send('true')
    } catch (err) {
      res.send('false')
    }
  }

  if (count == '0') {
	  newpresence(pers, date)
	} else {
	  checkHeureMidi(pers, date)
	}
})

// routes
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
