'use strict';
module.exports = (sequelize, DataTypes) => {
  var message = sequelize.define('message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  });
  message.associate = function(model) {
    message.belongsTo(model.user, {foreignKey: 'fk_userId', targetKey: 'userId' }); 
    message.belongsTo(model.ticket, {foreignKey: 'fk_ticketId', targetKey: 'ticketId' }); 
  };
  return message;
};