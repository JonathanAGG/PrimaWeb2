/**
* @descripción Módulos, archivos y servicios REST usados por el servidor
* @autor Adrián Sánchez <asanchez@imaginexyz.com>
*/


//Módulos Necesitados
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const basicServices = require('./basic');


let app = express();
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname+'/webpage'));


app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
  next();
});

app.get('/data', basicServices.getData);  //GET
app.get('/now', basicServices.getNow);  //GET
app.post('/workshop', basicServices.reservationWorkshop);
app.post('/conference', basicServices.reservationConference);
//app.post('/query', basicServices.getQuery); //POST 
app.post('/queries', basicServices.getQueries); //POST 


app.get('/test', (req, res) => {
  console.log(req.query.id);
  res.send(200, req.query.id);
}); //POST 

//Redirección por defecto
app.get('*', (req, res) => {
    res.redirect('../#home', 404);
});


//Habilitar puerto de escucha para el servidor

let server = app.listen(3000, function(){
  console.log('Server Started Listening 3000');
})
