"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("projects", "notebookId", Sequelize.INTEGER),
      queryInterface.addColumn(
        "projects",
        "notebookSequence",
        Sequelize.INTEGER
      ),
    ]);
  },

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("projects", "notebookId"),
      queryInterface.removeColumn("projects", "notebookSequence"),
    ]);
  },
};
