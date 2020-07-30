const fs = require('fs');

writeToFile = (filename, body) => {
    fs.writeFile(filename, JSON.stringify(body), (err, data) => {
        if(err) {
            console.log("File writer error");
        }
    });
}

exports.writeToFile = writeToFile;