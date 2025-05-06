//Node backend server
var express = require('express');
let app = express();
require('dotenv').config();

const routes = require('./src/routes');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const server = http.createServer(app);
var io = new Server(server, { cors: { origin: "*" } });
const initSocket = require('./src/services/socket')

global.Io = io;

const cors = require('cors');
app.use(express.json(true));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/public/view');
app.use(function (req, res, next) { req.io = io; next(); });
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
mongoose.Promise = global.Promise;

//connected databse
mongoose.connect('mongodb://127.0.0.1:27017/backend-db', { useNewUrlParser: true, useUnifiedTopology: true }).catch(console.error());

//Listen server port:
let PORT = 5000;
server.listen(PORT, () => { console.log('SERVER IS RUNNING ON:', 'http://localhost:' + PORT); initSocket(); });
