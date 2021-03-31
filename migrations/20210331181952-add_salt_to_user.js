'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return await queryInterface.addColumn(
      'Users',
      'salt',
      {
        type: Sequelize.STRING
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('Users', 'salt')
  }
};
