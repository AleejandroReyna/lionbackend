'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     return await queryInterface.addColumn(
      'FavoriteBreeds',
      'parent',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('FavoriteBreeds', 'parent')
  }
};
