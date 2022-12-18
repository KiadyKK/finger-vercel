const dbConfig = require("../config/db.config.js");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;
db.personnel = require("./personnel.model");
db.presence = require("./presence.model");

module.exports = db;