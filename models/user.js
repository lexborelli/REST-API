'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init({

    firstName: { 
      type: DataTypes.STRING,
      allowNull: false, 
    }, 
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
      password: { 
        type: DataTypes.STRING,
        allowNull: false,
  },
 }, { 
    sequelize,
    modelName: 'User',
 });

 // In the Users model, added a one-to-many association between the User and Course models using the hasMany() method.

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
       fieldName: 'userId',
       allowNull: false,
      },
      as: 'courses', //alias
    });
  };

  return User;
};