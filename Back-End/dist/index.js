"use strict";
const express = require('express');
const cors = require('cors');
const { port } = require('./config.js');
const organizers = require('./routes/v1/organizers');
const participants = require('./routes/v1/participants');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/v1/organizers', organizers);
app.use('/v1/participants', participants);
app.get('/', (req, res) => {
    res.send({ message: 'Online' });
});
app.all('*', (req, res) => {
    res.status(404).send({ error: 'Page does not exist' });
});
app.listen(port, () => {
    console.log(`Connected - ${port}`);
});
