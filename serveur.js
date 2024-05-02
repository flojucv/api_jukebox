/*-----IMPORT----*/
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const port = 3000
const version = "v1"
const router = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.json');
const specs = swaggerJsdoc(options);

const Music = require('./model/Music.js');
const sequelize = require('./db/dbConnect');

(async function dbConnect() {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
})();


/*-----FUNCTION----*/
function myCors(req, res, nxt) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Content-Type, Accept, Accept-Language, Origin, User-Agent');
  if(req.method === 'OPTIONS') {
      res.sendStatus(204);
  }
  else {
      nxt();
  }
}



(async () => {
  await Music.sync().then(() => {
    console.log('Models synchronized successfully.');
  }).catch(e => {
    console.log(e);
  });
})();

/*-----CODE----*/
app.use(myCors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(`/api/${version}`, router);
app.use( `/api/${version}/api-docs`, swaggerUi.serve, swaggerUi.setup(specs, { explorer : true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

