import { ConferenceManager } from "./ConferenceManager";
import { Application } from 'express';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

const io = require('socket.io');
const morgan = require('morgan');
const debug = require('debug')('app');

const port = <number>(process.env.PORT || 4000);
const app: Application = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(cors());
app.set('port', port);
app.use(morgan('tiny'))
app.set('json spaces', 2);
app.use(bodyParser.urlencoded({
    extended: true
}));

const conferManager: ConferenceManager = new ConferenceManager(app, server, io(server));

app.get("/", (req, res) => {
    res.send('hello world');
});

app.get("/conf_list", (req, res) => {
    const conferences = conferManager.getConferences();
    debug(conferences);
    res.json(conferences);
});

app.post("/create_conf", (req, res) => {
    const { confName } = req.body;
    debug(confName)
    conferManager.conferenceInit(confName);
    res.json(confName);
});

server.listen(app.get('port'),() => {
    debug('Express server listening on port ' + app.get('port'));
});
