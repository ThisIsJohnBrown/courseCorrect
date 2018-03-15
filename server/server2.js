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

const jsonData = fse.readJsonSync('./41.json');
let currStates = jsonData;

const servoMin = 150;
const servoMax = 600;
const servoDiff = servoMax - servoMin;

app.post('/update', function (req, res) {
    console.log(req.body);
    currStates = req.body;
    sendCurr();
    res.send(req.body);
})

function sendCurr() {
    const data = currStates.map(x => {
        return Math.floor(servoMin + (x.curr/100) * servoDiff)
    });
    port.write(data.toString() + ';');
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

// setInterval(animate, 100);

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))