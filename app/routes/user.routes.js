const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.post("/api/voira/personnel", controller.addPersonnel)
  app.get("/api/voira/personnel", controller.findPersonnel)
  app.get("/api/voira/presence", controller.findPresence)
};
