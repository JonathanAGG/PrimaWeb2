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
const adminServices = require('./adm1n');


let app = express();
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/adm1n', express.static(__dirname + '/admin')); //Página para vizualizar los datos ingresados
app.use('/images', express.static(__dirname + '/images')); //Página para vizualizar los datos ingresados
app.use(express.static(__dirname+'/webpage'));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin');
  next();
});

app.get('/data', basicServices.getData);  //GET
app.get('/now', basicServices.getNow);  //GET
//app.post('/workshop', basicServices.reservationWorkshop);
app.post('/conference', basicServices.reservationConference);
app.post('/contact', basicServices.contactInfo);
//app.post('/query', basicServices.getQuery); //POST 
app.post('/queries', basicServices.getQueries); //POST

app.post('/adm1n/pages/login', adminServices.loginUser);  
app.get('/adm1n/pages/admins', adminServices.getAdmins);  
app.post('/adm1n/pages/admin', adminServices.newAdmin);  

app.get('/adm1n/pages/info', adminServices.getInfo); 

app.get('/adm1n/pages/events', adminServices.getEvents); 
app.post('/adm1n/pages/event', adminServices.newEvent); 
app.put('/adm1n/pages/event', adminServices.editEvent); 

app.post('/qr', basicServices.qrRegister); 


app.get('/test', (req, res) => {
  console.log(req.query.id);
  res.send(200, req.query.id);
}); //POST 

//Redirección por defecto
app.get('*', (req, res) => {
    res.redirect('../#home', 404);
});


//Habilitar puerto de escucha para el servidor
let port = Number(process.env.PORT || 3000);
let server = app.listen(port, function(){
  console.log('Server Started Listening 3000');
})
