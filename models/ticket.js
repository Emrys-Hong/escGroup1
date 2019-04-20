'use strict';

module.exports = (sequelize, DataTypes) => {
  var ticket = sequelize.define('ticket', {
    ticketId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true    // PrimaryKey meant that it must have a unique value
    },
    messageCount:{        // supposed to use to count the number of messages done in a ticket
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    topic: {
      allowNull: false,
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    tag:{
      type: DataTypes.INTEGER,
      defaultValue: 0   // 0 = Queued, 1 = in-progress, 2 = solved
    },
    priority:{
      type: DataTypes.INTEGER,
      defaultValue: 0   // 0 = normal. 1 = emergency (reserved for Security Flaws, etc)
    }
    
  });
  ticket.associate = function(model) {
    ticket.belongsTo(model.user, {foreignKey: 'fk_userId', targetKey: 'userId' }); 
    ticket.hasMany(model.message, { foreignKey:'fk_ticketId' })
  }
  return ticket;
};