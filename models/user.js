'use strict';
const {
  Model
} = require('sequelize');
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.FavoriteBreed, {
        foreignKey: 'userId',
      })
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      get() {
        return () => this.getDataValue('password')
      }
    },
    salt: {
      type: DataTypes.STRING,
      get() {
        return () => this.getDataValue('salt')
      }
    },

  }, {
    sequelize,
    modelName: 'User',
  });

  User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
  }

  User.encryptPassword = function(text, salt) {
    return crypto.
      createHash('RSA-SHA256')
      .update(text)
      .update(salt)
      .digest('hex')
  }

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = User.generateSalt()
      user.password = User.encryptPassword(user.password(), user.salt())
    }
  }

  User.prototype.correctPassword = function(enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password()
  }

  User.beforeCreate(setSaltAndPassword)
  User.beforeUpdate(setSaltAndPassword)

  return User;
};


