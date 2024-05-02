const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnect');

const Music = sequelize.define(
  'Music',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sound: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'musics',
  }
);

(async () => {


})();
module.exports = Music;