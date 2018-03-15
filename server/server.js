var keypress = require('keypress');
var fse = require('fs-extra');

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
});

port.on('data', function (data) {
    console.log(data.toString('utf8'));
});

keypress(process.stdin);

const jsonData = fse.readJsonSync('./41.json');

let currServo = 0;
let currStates = jsonData;
const servoMin = 150;
const servoMax = 600;
const servoDiff = servoMax - servoMin;

console.log(currStates);

// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
 if (key && key.ctrl && key.name == 'c') {
    process.exit();
 } else if (ch == 's') {
     console.log('File saved!!')
     fse.writeJsonSync('./41.json', currStates);
 } else if (ch == 'z') {
    currStates[currServo].min = currStates[currServo].curr
    fse.writeJsonSync('./41.json', currStates);
 } else if (ch == 'x') {
    currStates[currServo].max = currStates[currServo].curr
    fse.writeJsonSync('./41.json', currStates);
 } else if (ch == 'm') {
    for (var i = 0; i < currStates.length; i++) {
        currStates[i].curr = currStates[i].max
    }
    sendCurr();
 } else if (ch == 'n') {
    for (var i = 0; i < currStates.length; i++) {
        currStates[i].curr = currStates[i].min
    }
    sendCurr();
 } else if (ch == 'p') {
    sendCurr()
 } else if (ch == 'l') {
    console.log(currStates); 
 } else if (ch == 'r') {
    var data = [
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100),
        Math.round(Math.random() * 100)
    ]
    port.write(data.toString() + ';');
 } else if ('0123456789abcdef'.indexOf(ch) !== -1) {
     console.log(`Setting currServo to ${parseInt(ch, 16)}`);
     currServo = parseInt(ch, 16);
 } else if (key) {
    if (key.name === 'up') {
        currStates[currServo].curr += 1;
        if (currStates[currServo].curr > 100) {
            currStates[currServo].curr = 100
        }
        sendCurr()
    } else if (key.name === 'down') {
        currStates[currServo].curr -= 1;
        if (currStates[currServo].curr < 0) {
            currStates[currServo].curr = 0
        }
        sendCurr()
    }
 }
});

function sendCurr() {
    const data = currStates.map(x => {
        return Math.floor(servoMin + (x.curr/100) * servoDiff)
    });
    port.write(data.toString() + ';');
}

var tick = 0;
function animate() {
    tick++
    for (var i = 0; i < currStates.length; i++) {
        var diff = Math.floor(currStates[i].min + ((1 + Math.sin(( + i/3) / 2)) / 2) * (currStates[i].max - currStates[i].min));
        currStates[i].curr = diff;
    }
    sendCurr();
}

setInterval(animate, 300);

process.stdin.setRawMode(true);
process.stdin.resume();