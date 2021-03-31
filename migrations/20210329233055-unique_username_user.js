'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.changeColumn('users', 'username',{
      type: Sequelize.STRING,
    })
  }
};
