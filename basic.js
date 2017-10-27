/**
* @autor Adrián Sánchez <contact@imaginexyz.com>
*/
const mongo = require('mongodb');
const nodemailer = require('nodemailer');


let gmailTransporter = function (callback) {
  let transporter = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: 'info@prismafest.com',
      pass: 'prismarocks'
    }
  });
  callback(transporter);
}

//Puerto de conexión con la base de datos (no es el mismo de escucha del servidor)
const uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/Prisma';


//Conexión con la base de datos
mongo.MongoClient.connect(uristring, function(err, database) {
    if(!err) {
        db = database; //Instancia de la base de datos
        console.log('Connected to the "Prisma" database');
    }
    else{
        console.log(404, 'Error Connecting to the "Prisma" database');
    }
});

//Función para el manejo de la zona horaria
Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

exports.sendEmail = function(req, res) {
  console.log(req.body);
  console.log(req.query);
  var  htmlText = '<div style="background:#F2F2F2"> <div id="div1" style=" background:#000000; text-align:center; max-width: 70%; margin: auto;"> <img style=" margin-top: 50px; width: 12%; margin-left: 72%;" src="https://prismafest.herokuapp.com/puchaus-02.png"> <img src="https://prismafest.herokuapp.com/felicidades-01.png" style="width:60%;"> <h3 style=" margin: 0px; font-size: 130%; font-family: lato; font-weight: 500; color: white; letter-spacing: 5px;">SOS DE LOS QUE SE ATREVEN</h3> <img style=" width: 12%; margin-right: 72%; margin-bottom: 50px;" src="https://prismafest.herokuapp.com/puchaus-01.png"> </div> <div id="div2" style=" background:#FFFFFF; text-align:center; max-width: 70%; margin: auto;">  <div style="display:inline-flex;"><h2 style="margin: 0px; margin-left:45px; padding-top: 80px; margin-bottom: 40px; font-size: 25px; font-family: lato; font-weight: bold; color: black; letter-spacing: 5px;">¿ESTÁS LISTO?</h2><img style=" max-height: 25px; padding-top: 80px;" src="https://prismafest.herokuapp.com/puchaus-03.png"></div> <p style="  margin: auto; margin-bottom: 40px; font-size: 18px; font-family: lato; font-weight: 500; color: #424242; width: 90%;">A pesar del miedo y la incertidumbre sos de los que toman riesgos. Ahora tienes el primer paso a lo desconocido. Esta aventura está llena de sueños, retos, fracasos y obstáculos, pero al final todo valdrá la pena.</p> <div style="height:100px;"> <a style="cursor: pointer; text-decoration: none;" href="https://prismafest.herokuapp.com/PrimerPrisma.pdf" download><img style="height:50px;max-width:90%;" src="https://prismafest.herokuapp.com/puchaus-04.png"></a> </div> </div> <div id="div3" style=" background:#F2F2F2; text-align:center; max-width: 70%; margin: auto;"> <a style="text-decoration: none; margin-left: 98%;" href="https://www.facebook.com/prismafest.cr/" target="_blank"><img style=" max-height: 20px; margin-right: 10px; margin-top: 10px; cursor: pointer;" src="https://prismafest.herokuapp.com/puchaus-05.png"></a> <br> <img style=" max-height: 100px; margin-top: 40px; margin-bottom: 30px;" src="https://prismafest.herokuapp.com/puchaus-06.png"> <br> <div style="height:80px;"> <a style="text-decoration: none; color: #999999; cursor: pointer; font-family: lato; font-size: 20px;" href="https://prismafest.com/" target="_blank">www.prismafest.com</a> </div> </div> </div>',
    mailOptions = {
      from: '"Prisma Fest" <info@prismafest.com>',
      to: req.body.email, // receiver
      subject: 'Prisma Fest', // subject
      html: htmlText
    };
  gmailTransporter(function (transporter) {
    transporter.sendMail(mailOptions, function(error, info){
      console.log('Enviando Email');
      if(error)console.log(error);
      else console.log(info);
      res.send(200,{info:'Message Sent'} ); 
    })
  })
};


/* Funciones CRUD Básicas */

//GET - READ
exports.getData = (req,res) => {
    db.collection('Sensors').find({}).toArray((error, doc) => {
        if(error) {
            throw error;
            res.send(400, error);
        }
        else{
            res.send(200, doc);
        }
    })
}


//POST- CREATE
exports.newPost = (req, res) => {
    let resource = req.body;
    let minutesNow = new Date().getMinutes();
    let minutesRange = Math.floor(minutesNow/range) * range;
    //resource['date'] = new Date().addHours(-6);
    resource['date'] = new Date();
    resource['year'] = new Date().getFullYear();
    resource['month'] = new Date().getMonth()+1;
    resource['day'] = new Date().getDate();
    resource['hour'] = new Date().getHours();
    resource['minute'] = minutesRange;
    db.collection('Sensor'+req.body.sensor).insert(resource, (error, doc_project) =>{
        if(error) {
            throw error;
            res.send(400, error);
        }
        else{
            res.send(200, resource);
        }
    })
}

//MQTT- CREATE
exports.reservationWorkshop = (req, res) => {
    console.log(req.body);
    res.send(200, true);
}

exports.reservationConference = (req, res) => {
    db.collection('reservations').find({_id:req.body.conf, $where:"this.signed.length < this.max"}).toArray((error, doc) => {
        if(error) {throw error; res.send(400, {error:'Hemos tenido un error, favor solicitar la reserva nuevamente'})}
        else if(doc[0] === undefined) res.send(400, {error:'No quedan campos libres en la conferencia.'});
        else{
            let user = {email:req.body.email};
            user[req.body.conf] = true;
            db.collection('users').find(user).toArray((error2, doc2) => {
                if(error2) {throw error2; res.send(400, {error:'Hemos tenido un error, favor solicitar la reserva nuevamente'})}
                else if(doc2[0] !== undefined) res.send(400, {error:'Usted ya se encuentra inscrito pero todo bien.'});
                else{
                    user['name'] = req.body.name;
                    db.collection('users').findAndModify({email:req.body.email},{},{$set:user}, {upsert: true, new: true}, (error3, doc3) => {
                        if(error3) {throw error3; res.send(400, {error:'Hemos tenido un error, favor solicitar la reserva nuevamente'})}
                        else{
                            db.collection('reservations').findAndModify({_id:req.body.conf},{},{$push:{signed:req.body.email}}, (error4, doc4) => {
                                if(error4) {throw error4; res.send(400, {error:'Hemos tenido un error, favor solicitar la reserva nuevamente'})}
                                else{
                                    let htmlText = '<div style="background:#F2F2F2"> <div id="div1" style=" background:#000000; text-align:center; max-width: 70%; margin: auto;"> <img style=" margin-top: 50px; width: 12%; margin-left: 72%;" src="https://prismafest.herokuapp.com/puchaus-02.png"> <img src="https://prismafest.herokuapp.com/felicidades-01.png" style="width:60%;"> <h3 style=" margin: 0px; font-size: 130%; font-family: lato; font-weight: 500; color: white; letter-spacing: 5px;">SOS DE LOS QUE SE ATREVEN</h3> <img style=" width: 12%; margin-right: 72%; margin-bottom: 50px;" src="https://prismafest.herokuapp.com/puchaus-01.png"> </div> <div id="div2" style=" background:#FFFFFF; text-align:center; max-width: 70%; margin: auto;">  <div style="display:inline-flex;"><h2 style="margin: 0px; margin-left:45px; padding-top: 80px; margin-bottom: 40px; font-size: 25px; font-family: lato; font-weight: bold; color: black; letter-spacing: 5px;">¡ESTÁS CONFIRMADO!</h2><img style=" max-height: 25px; padding-top: 80px;" src="https://prismafest.herokuapp.com/puchaus-03.png"></div> <p style="  margin: auto; margin-bottom: 40px; font-size: 18px; font-family: lato; font-weight: 500; color: #424242; width: 90%;">Bienvenido ' + req.body.name+'. Estamos contentos de contar con su presencia en el evento.</p><p style="  margin: auto; padding-bottom: 40px; font-size: 18px; font-family: lato; font-weight: 500; color: #424242; width: 90%;">Le confirmamos la reservación de su espacio en la conferencia <b>'+doc4.value.description+'</b>. Nos vemos el día del evento.</p> </div> <div id="div3" style=" background:#F2F2F2; text-align:center; max-width: 70%; margin: auto;"> <a style="text-decoration: none; margin-left: 98%;" href="https://www.facebook.com/prismafest.cr/" target="_blank"><img style=" max-height: 20px; margin-right: 10px; margin-top: 10px; cursor: pointer;" src="https://prismafest.herokuapp.com/puchaus-05.png"></a> <br> <img style=" max-height: 100px; margin-top: 40px; margin-bottom: 30px;" src="https://prismafest.herokuapp.com/puchaus-06.png"> <br> <div style="height:80px;"> <a style="text-decoration: none; color: #999999; cursor: pointer; font-family: lato; font-size: 20px;" href="https://prismafest.com/" target="_blank">www.prismafest.com</a> </div> </div> </div>',
                                    mailOptions = {
                                      from: '"Prisma Fest" <info@prismafest.com>',
                                      to: req.body.email, // receiver
                                      subject: 'Prisma Fest', // subject
                                      html: htmlText
                                    };
                                    gmailTransporter(function (transporter) {
                                        transporter.sendMail(mailOptions, function(error, info){
                                          console.log('Enviando Email');
                                          if(error)console.log(error);
                                          else console.log(info);
                                          res.send(200,{info:'Message Sent'} ); 
                                        })
                                    })
                                }
                            })
                        }
                    });
                }
            })
        }
    })
}

exports.getNow = (req,res) => {
    let espsArray = [];
    for (let i = 1; i <= 15; i++) {
        espsArray.push(i);
    }
    Promise.all(
        espsArray.map(number => {
            return new Promise( 
                resolve => {
                    db.collection('Sensor'+number).findOne({},{"sort":{"date":-1}}, (error, doc) => {
                        if(error) {
                            throw error;
                        }
                        else{
                            if(doc != null){
                                let newOne = {}
                                newOne[number] = doc;
                                resolve(newOne);
                            }
                            else{
                                let newOne = {}
                                newOne[number] = {"sensor":number, "temp": 0, "hum":0};
                                resolve(newOne);
                            }
                        }
                    })
                }
            )
        })
    ).then(val => {
        res.send(200, val);
    }, err => {
        console.log(err);
        res.send(400, err);
    });
}

let headersArray = function (argument, callback) {
    let headers = ['Fecha','Hora'];
    Promise.all(
        argument.map(number => {
            return new Promise( 
                resolve => {
                    //let 
                    headers.push('Temp' + number);
                    headers.push('Hum' + number);
                    resolve(true);
                }
            )
        })
    ).then(val => {
        //headers.push(val);
        callback(headers);
    }, err => {
        console.log(err);
    });
}



let docMap = function (argument, sensoresArray, headers, callback) {
    let values = [];
    Promise.all(
        argument.map(dateInfo => {
            return new Promise( 
                resolve => {
                    let emptyTemp = {},
                        emptyHum = {},
                        emptyValues = {},
                        dateMinute = '00';
                    if(dateInfo._id.minute != 0) dateMinute = dateInfo._id.minute;
                    emptyValues['Fecha'] = (dateInfo._id.day + '/' + dateInfo._id.month + '/' + dateInfo._id.year);
                    emptyValues['Hora'] = (dateInfo._id.hour + ':' + dateMinute);
                    
                    sensoresArray.map(number => {
                        let sensorTemp = 'Temp' + number,
                            sensorHum = 'Hum' + number;
                        emptyTemp[number] = 0;
                        emptyHum[number] = 0;
                        emptyValues[sensorTemp] = 0;
                        emptyValues[sensorHum] = 0;
                    })
                    
                    dateInfo['temp'] = emptyTemp;
                    dateInfo['hum'] = emptyHum;

                    dateInfo.data.map(info => {
                        let sensorTemp = 'Temp' + info.sensor,
                            sensorHum = 'Hum' + info.sensor;
                        dateInfo.temp[info.sensor] = info.temp;
                        dateInfo.hum[info.sensor] = info.hum;  
                        emptyValues[sensorTemp] = info.temp;
                        emptyValues[sensorHum] = info.hum; 
                    })
                    
                    values.push(emptyValues);
                    //headers.push('Hum' + number);
                    resolve(dateInfo);
                }
            )
        })
    ).then(val => {

        let  csv = json2csv({ data: values, fields: headers });
 
        fs.writeFile('basic/datos.csv', csv, err => {
          if (err) throw err;
          console.log('file saved');
        });
        
        callback(val);
    }, err => {
        console.log(err);
    });
}

exports.getQueries = (req,res) => {
    let dateOne = req.body.dateOne.split('-'),
        dateSecond = req.body.dateSecond.split('-'),
        sensoresArray = req.body.sensors,
        firstDate = new Date(dateOne[0],(parseInt(dateOne[1]) - 1),dateOne[2], req.body.hourOne, req.body.minuteOne),
        lastDate = new Date(dateSecond[0],(parseInt(dateSecond[1]) - 1),dateSecond[2], req.body.hourSecond, req.body.minuteSecond);
    db.collection('Sensors').aggregate([
    {$match:{"date":{"$gte":firstDate, "$lte":lastDate}}},
    {$group:{'_id':{'year':'$year', 'month':'$month', 'day':'$day', 'hour':'$hour', 'minute':'$minute'}, 'data':{'$push':{'sensor':'$sensor', 'temp':'$temp', 'hum':'$hum'}}}},
    { "$sort": { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1, "_id.minute": 1} }], (err, doc_res) => {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            let values = [];
            headersArray(sensoresArray, headers =>{
                console.log(headers);
                docMap(doc_res, sensoresArray, headers, values => {
                    console.log(values);
                    res.send(200, values);
                });
            });
            /*sensoresArray.map(number => {
                headers.push('Temp' + number);
                headers.push('Hum' + number);
            })

            doc_res.map(dateInfo => {
                let emptyTemp = {},
                    emptyHum = {},
                    emptyValues = {},
                    dateMinute = '00';

                if(dateInfo._id.minute != 0) dateMinute = dateInfo._id.minute;
                
                emptyValues['Fecha'] = (dateInfo._id.day + '/' + dateInfo._id.month + '/' + dateInfo._id.year);
                emptyValues['Hora'] = (dateInfo._id.hour + ':' + dateMinute);

                sensoresArray.map(number => {
                    let sensorTemp = 'Temp' + number,
                        sensorHum = 'Hum' + number;
                    emptyTemp[number] = 0;
                    emptyHum[number] = 0;
                    emptyValues[sensorTemp] = 0;
                    emptyValues[sensorHum] = 0;
                })

                dateInfo['temp'] = emptyTemp;
                dateInfo['hum'] = emptyHum;
                dateInfo.data.map(info => {
                    let sensorTemp = 'Temp' + info.sensor,
                        sensorHum = 'Hum' + info.sensor;
                    dateInfo.temp[info.sensor] = info.temp;
                    dateInfo.hum[info.sensor] = info.hum;  
                    emptyValues[sensorTemp] = info.temp;
                    emptyValues[sensorHum] = info.hum; 
                })
                values.push(emptyValues);
            })
            */

            
        }
    });
}

exports.newLadron = (newJson, io) => {
    let resource = newJson;
    resource['date'] = new Date();
    resource['year'] = new Date().getFullYear();
    resource['month'] = new Date().getMonth()+1;
    resource['day'] = new Date().getDate();
    resource['hour'] = new Date().getHours();
    let newMsg = '<b>' + new Date().getHours() + ':' + new Date().getMinutes() + '</b> ' + newJson.msg;
    io.emit('alert', newMsg);
    db.collection('Ladron').insert(resource, (error, doc_project) =>{
        if(error) {
            throw error;
            console.log(error);
        }
        else{
            console.log(resource);
        }
    })
}


exports.getLadron = (req,res) => {
    db.collection('Ladron').find({}).toArray((error, doc) => {
        if(error) {
            throw error;
            res.send(400, error);
        }
        else{
            res.send(200, doc);
        }
    })
}
