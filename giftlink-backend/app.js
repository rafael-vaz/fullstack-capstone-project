require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./logger');
const connectToDatabase = require('./models/db');
require('./util/import-mongo/index');

const app = express();
app.use("*", cors());
const port = 3060;

// connect to mongodb once at startup
connectToDatabase().then(() => {
    logger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());
app.use(pinoHttp({ logger }));

const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

app.get("/", (req, res) => {
    res.send("Inside the server");
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// error handler must be registered last so it catches errors from all routes above
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 