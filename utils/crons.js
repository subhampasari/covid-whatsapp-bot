const cron = require("node-cron"); 
const covidData = require('./covidData');

fetchCovidDataCron = () => {
    cron.schedule("*/30 * * *  *", function() { 
        console.log("fetching data every 30 mins"); 
        covidData.fetchCovidData();
    });
}

exports.fetchCovidDataCron = fetchCovidDataCron;