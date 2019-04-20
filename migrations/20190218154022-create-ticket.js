'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      responses: {
        allowNull: true,
        type: Sequelize.STRING
      },
      topic: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status:{
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0   // 0 = Queued, 1 = in-progress, 2 = solved
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull:false,
        type: Sequelize.DATE
      }
    }); 
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tickets');
  }
};
