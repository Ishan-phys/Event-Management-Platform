const express = require('express');

const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use('/events', eventRouter);

module.exports = app;
