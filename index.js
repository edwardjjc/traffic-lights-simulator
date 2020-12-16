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

let mqttClient = mqtt.connect("mqtt://localhost:1883");

wss.on("connection", (ws) => {

    mqttClient.on('connect', () => {
        mqttClient.subscribe('INICIO_CRUCE_CALLE', (err) => {
            ws.send("CRUZAR_CALLE_HORIZONTAL");
        });
    });

    mqttClient.subscribe('INICIO_CRUCE_CALLE', (err) => {
        console.log("Mensaje recibido");
    })

    ws.on("message", (message) => {
        mqttClient.publish(message.event, message);
        console.log(`mensaje recibido ${message}`)
    })

    ws.send('INICIAR_SEMAFORO');
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})