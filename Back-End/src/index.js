const express = require('express');
const cors = require('cors');

const { port } = require('./config.js');

const { organizers } = require('./routes/v1');

const app = express();

app.use(express.json());
app.use(cors());


app.use('/v1/organizers/', organizers);



app.get('/', (req, res) => {
    res.send({ message: 'Online' });
});

app.all('*', (req, res) => {
    res.status(404).send({ error: 'Page does not exist' });
});

app.listen(port, () => {
    console.log(`ONLINE.... ${port}`)
});