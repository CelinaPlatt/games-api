const express = require('express');
const apiRouter = require('./routers/api.router');

const app = express();

app.use('/api', apiRouter);

//If path is not accounted for
app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

//Handle rest of errors



//If error is not accounted for
app.use((err,req,res,next)=>{
    console.log(err,'<<< unhandled error');
    res.status(500).send({msg:'Internal Server Error'})
})


module.exports = app;
