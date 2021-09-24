const express = require('express');
const { handleCustomErrors, handle500errors, handle404Errors } = require('./errors/errors.controllers');
const apiRouter = require('./routers/api.router');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

//If path is not accounted for
app.all('*', handle404Errors);

//Handle rest of errors
app.use(handleCustomErrors);

//If error is not accounted for
app.use(handle500errors);

module.exports = app;
