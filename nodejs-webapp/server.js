
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const basicAuth = require('./_helpers/basicauth');

const app = express();

// dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const db = require("./models");
const { category } = require("./models");
 db.sequelize.sync();



db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
  });

var corsOptions = {
  origin: "http://localhost:8081"
};

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to webapp application." });
});

require('./routes/auth.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});