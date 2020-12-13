const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const WebSocket = require('ws');

let app = express();

const server = http.createServer(app);

let wss = new WebSocket.Server({ server });

app.engine('html', require('ejs').renderFile);
app.use(express.static('views'))
app.use(express.static('assets'));

const port = 8081

app.get('/', (req, res) => {
    res.render('TrafficSimulator.html')
})

let mqttClient = mqtt.connect("mqtt://localhost:1883")

wss.on("connection", (ws) => {

    mqttClient.on('connect', () => {
        mqttClient.subscribe('CruzarLaCalleV', (err) => {
            ws.send("CRUZAR_CALLE_VERTICAL");
        });
        mqttClient.subscribe('CruzarLaCalleH', (err) => {
            ws.send("CRUZAR_CALLE_HORIZONTAL");
        });
    })

    ws.on("message", (message) => {
        console.log(`mensaje recibido ${message}`)
    })

    ws.send('INICIAR_SEMAFORO');
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})