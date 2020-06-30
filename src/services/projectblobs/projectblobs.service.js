// Initializes the `projectblobs` service on path `/projectblobs`
const { Projectblobs } = require("./projectblobs.class");
const createModel = require("../../models/projectblobs.model");
const hooks = require("./projectblobs.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate")
  };

  // Initialize our service with any options it requires
  app.use("/projectblobs", new Projectblobs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("projectblobs");

  service.hooks(hooks);
};
