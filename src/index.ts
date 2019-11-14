import { App } from "./app";
import { Application } from 'express';
import express from 'express';
import http from 'http';

var io = require('socket.io');

const expressInstance:Application = express();

const httpInstance = http.createServer(expressInstance);

const app: App = new App(expressInstance, httpInstance, io(httpInstance));

const PORT: number = 3000;

app.listen(PORT,() => {
    console.log('Express server listening on port ' + PORT);
})
