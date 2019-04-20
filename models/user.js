/* jshint indent: 2 */
'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    ticketCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });
  user.associate = function(model) {
    user.hasMany(model.ticket, { foreignKey: 'fk_userId' });
    user.hasMany(model.message, { foreignKey: 'fk_userId' })
  };
  return user;
};
