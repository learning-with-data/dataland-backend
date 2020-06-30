// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const projectblobs = sequelizeClient.define("projectblobs", {
    blob: {
      type: DataTypes.BLOB("medium"),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    indexes: [
      {
        name: "createdAt_projectId",
        fields: ["createdAt", "projectId"],
      }
    ],
    updatedAt:false
  });

  projectblobs.associate = function (models) {
    projectblobs.belongsTo(models.projects);
  };

  return projectblobs;
};
