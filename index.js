const express = require('express');
const os = require('os');
const path = require('path');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const app = express();
const port = 3000;

let parser = new Readline();
let serialPort = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600
});
let stats = {};

serialPort.pipe(parser);
parser.on('data', handleProbeData);

app.use("/app/", express.static(path.join(__dirname, "/html")));
app.use("/resources/", express.static(path.join(__dirname, "/node_modules")));

app.get('/api/stats', function (req, res) {
	try {
	    stats.ip = os.networkInterfaces().eth0[0].address;
	} catch (err){
		console.error("Could not add IP to response...", err);
	}
    res.send(stats);
});

app.listen(port, function () {
    console.log(`App listening: http://localhost:${port}/app`);
});

function handleProbeData(str) {
    let parts = str.split("=");
    let info = parts[1].trim();
    if (info.indexOf(";") == info.length - 1)
        info = info.substring(0, info.length - 1);
    if (str.indexOf("Temperature") == 0) {
        stats.temperature = info;
    } else if (str.indexOf("Humidity") == 0) {
        stats.humidity = info;
    } else if (str.indexOf("Ammonia") == 0) {
        stats.ammonia = info;
    }
}
