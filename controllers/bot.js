const fs = require('fs'); 
const path = require('path');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const covidDataFilePath = path.join(__dirname, '../data/covidData.json');

const countryNotFoundMessage = "Country not found in database";
const defaultMessage = "Hi, this is Subham Pasari. Its nice meeting you. Have a good day!";

readFile = (filePath) => {
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath, (err, data)=>{
            if (err) {
                reject(err); // in the case of error, control flow goes to the catch block with the error occured.
            }
            else {
                resolve(data);  // in the case of success, control flow goes to the then block with the content of the file.
            }
        });
    })
}

findValue = (queryType, countryCode, res) => {
    readFile(covidDataFilePath)
    .then(data => {
            const jsonData = JSON.parse(data.toString());
            if(countryCode.toLowerCase() === "total") {
                let global = jsonData.Global;
                countryCode = "Total";
                return global;
            }
            
            let countries = jsonData.Countries;
            let requiredValue = countries.filter((country) => {
                return country.CountryCode === countryCode;
            });
            if(requiredValue.length === 0) { 
                throw countryNotFoundMessage;
            }
            return requiredValue[0];
    })
    .then((obj) => {
        let replyString = "";
        switch(queryType) {
            case 'cases' : {
                replyString = countryCode + " Active Cases " + (obj.TotalConfirmed - obj.TotalRecovered); 
                replyToUser(replyString, res);
                break;
            }
            case 'deaths' : {
                replyString = countryCode + " Deaths " + obj.TotalDeaths; 
                replyToUser(replyString, res);
                break;
            }
            default: break;
        }
    })
    .catch(err => {
        replyToUser(err, res);
    });
}

isValidMessage = (message) => {     // checks if the message contains 2 words, the first one being cases or deaths. Does not check country code
    if(!message || message.indexOf(' ') === -1)
        return false;
    let words = message.split(' ');
    if(words.length !== 2) {
        return false;
    }
    words[0] = words[0].toLowerCase();
    if(words[0] === 'cases' || words[0] === 'deaths')
        return true;
    return false;
}

processMessage = (incomingMessage, res) => {
    let returnMessage;
    if(isValidMessage( incomingMessage )) {
        let words = incomingMessage.split(' ');
        let value = 0;
        words[0] = words[0].toLowerCase();
        findValue(words[0], words[1], res);
    }
    else {
        replyToUser(defaultMessage, res);
    }

    return returnMessage;
}

exports.serveData = (req, res) => {
    const incomingMessage = req.body.Body;
    processMessage(incomingMessage, res);    // processMessage will process and return a output for the given message
}

replyToUser = (message, res) => {
    const twiml = new MessagingResponse();
    twiml.message(message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
}