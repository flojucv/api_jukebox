const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../db/database.sqlite'
});

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
  }
);

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();
// `sequelize.define` also returns the model
console.log(Music === sequelize.models.Music); // true
module.exports = Music;

