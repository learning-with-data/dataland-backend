'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id from users WHERE username = "demo-user";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    return queryInterface.bulkInsert('projects', [
      {
        title: 'Project 1',
        description: 'Random description of project 1.',
        userId: users[0].id,
        public: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Project 2',
        description: 'Even more random description of project 2.',
        userId: users[0].id,
        public: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Project 3',
        description: 'Even more random description of project 3. This one has some more text to test really really long text rendering.',
        userId: users[0].id,
        public: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Project 4',
        description: 'Short description.',
        userId: users[0].id,
        public: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Project 5',
        description: '',
        public: false,
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id from users WHERE `username` = "demo-user";',
      { type: Sequelize.QueryTypes.SELECT }
    );
    return queryInterface.bulkDelete('projects',
      {
        userId: users[0].id,
      }, {});
  }
};
