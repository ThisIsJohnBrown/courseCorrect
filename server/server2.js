const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('src'));
app.use(bodyParser.json());

var fse = require('fs-extra');

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
});

port.on('data', function (data) {
    console.log(data.toString('utf8'));
});

let currStates = fse.readJsonSync('./41.json');

const servoMin = 200;
const servoMax = 550;
const servoDiff = servoMax - servoMin;

app.post('/update', function (req, res) {
    currStates = req.body;
    sendCurr();
    res.send(req.body);
})

function sendCurr() {
    let tick = 0;
    let data = currStates.map(x => {
        return Math.floor(servoMin + (servoDiff * (currStates[tick++].curr / 100)));
    });
    data.unshift(0);

    tick = 0;
    let data2 = currStates.map(x => {
        return Math.floor(servoMin + (servoDiff * (1 - (currStates[tick++].curr / 100))));
    });
    data2.unshift(1);

    tick = 0;
    let data3 = currStates.map(x => {
        return Math.floor(servoMin + (servoDiff * (1 - (currStates[tick++].curr / 100))) - 1);
    });
    data3.unshift(2);
    console.log("Data sent");
    console.log(data.toString() + ',;');
    port.write(data.toString() + ',;');
    // console.log(data2.toString() + ',;');
    // port.write(data2.toString() + ',;');
    // console.log(data3.toString() + ',;');
    // port.write(data3.toString() + ',;');
}

var tick = 0;
function animate() {
    tick++;
    for (var i = 0; i < currStates.length; i++) {
        var diff = Math.floor(currStates[i].min + ((1 + Math.sin((tick + i/3) / 2)) / 2) * (currStates[i].max - currStates[i].min));
        currStates[i].curr = diff;
    }
    sendCurr();
}

// setInterval(animate, 1000);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))