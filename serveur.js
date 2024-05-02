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


(async () => {
  //const music1 = await Music.create({ cover: "harry_styles-watermelon_sugar.jpg", sound: "Harry_Styles-Watermelon_Sugar.mp3", title: "Harry Styles - Watermelon Sugar", category: "pop"});

  //console.log(await Music.findAll());
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

(async function dbConnect() {
  const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './db/database.sqlite'
  });
  
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
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

