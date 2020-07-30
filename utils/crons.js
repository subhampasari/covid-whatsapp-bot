const cron = require("node-cron"); 
const https = require('https');
const path = require('path');
const fs = require('fs');

writeToFile = (filename, body) => {
    fs.writeFile(filename, JSON.stringify(body), (err, data) => {
        if(err) {
            console.log("File writer error");
        }
    });
}

fetchCovidData = () => {
    const options = {
        'method': 'GET',
        'hostname': covidAPIHost,
        'path': dataPath,
        'headers': {},
        'maxRedirects': 20
    };
    const req = https.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            let body = Buffer.concat(chunks);
            body = JSON.parse(body);
            writeToFile(dataFilePath, body);
        });
              
        res.on("error", function (error) {
            console.error(error);
        });
    });
    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}

exports.fetchCovidDataCron = () => {

    const dataFilePath = path.join(__dirname, '../data/covidData.json');
    const covidAPIHost = 'api.covid19api.com';
    const dataPath = '/summary';

    cron.schedule("*/30 * * * *", function() { 
        console.log("fetching data every 30 mins"); 
        fetchCovidData();
    });
}
