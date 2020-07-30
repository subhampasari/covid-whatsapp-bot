const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const botController = require('./controllers/bot');
const cronJobs = require('./utils/crons');

const port = process.env.PORT;

cronJobs.fetchCovidData();
cronJobs.fetchCovidDataCron();

app.post('/api/v1/message', botController.serveData);

app.listen(port, () => console.log("server running on port", port ));