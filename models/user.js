'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init({

    firstName: { 
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notNull: {
          msg: 'A first name is required'
        }, 
        notEmpty: {
          msg: 'Please provide your first name'
        }
      }
    }, 
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        }, 
        notEmpty: {
          msg: 'Please provide your last name'
        }
      }
    },
    emailAddress: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An email address is required'
        }, 
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
      password: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A valid password is required'
          }, 
          notEmpty: {
            msg: 'Please provide a password'
          }
        }
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