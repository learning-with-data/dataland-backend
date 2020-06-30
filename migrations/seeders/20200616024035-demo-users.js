'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'demo-user',
        email: 'demo-user@example.com',
        password: bcrypt.hashSync('secret', 10),
        admin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'demo-admin',
        email: 'example@example.com',
        password: bcrypt.hashSync('supersecret', 10),
        admin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete('users',
      {
        username: {
          [Op.or]: ['demo-user', 'demo-admin']
        }
      }, {});
  }
};
