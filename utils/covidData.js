const https = require('https');
const path = require('path');

const fileOperations = require('./fileOperations');

fetchCovidData = () => {
    const dataFilePath = path.join(__dirname, '../data/covidData.json');
    const covidAPIHost = 'api.covid19api.com';
    const dataPath = '/summary';
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
            fileOperations.writeToFile(dataFilePath, body);
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

exports.fetchCovidData = fetchCovidData;