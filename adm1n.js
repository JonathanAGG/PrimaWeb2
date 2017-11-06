/**
* @autor Adrián Sánchez <asanchez@imaginexyz.com>
*/
const mongo = require('mongodb');

//Puerto de conexión con la base de datos (no es el mismo de escucha del servidor)
const uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGODB_URI || 
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

exports.loginUser = (req, res) => {
	let admin = {email:req.body.email, password: req.body.password};
	let x = new Date(),
		y = Math.round((((x-1)/100000)%1)*100000);
    db.collection('admin').findAndModify(admin,{},{$set:{token:y}}, {upsert: false, new: false}, (error, doc) => {
        if(error) {throw error; res.send(400, {error:'Hemos tenido un error, favor solicitar la reserva nuevamente'})}
        else if(doc.value === null) res.send(400, {error:'VA JALANDO HIJUEPUTA'});
        else{
        	console.log(doc.value);
        	admin['token'] = y;
        	admin['name'] = doc.value.name;
            res.send(200,admin);
        }
    })
}

exports.getAdmins = (req, res) => {
    checkHeaders(req.headers, callback => {
    	if(callback) {
		    db.collection('admin').find({}).toArray((error, doc) => {
		        if(error) {throw error; res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});}
		        else res.send(200, doc);
		    })
    	}
    	else {
    		res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});
    	}
    })
}

exports.newAdmin = (req, res) => {
    checkHeaders(req.headers, callback => {
        if(callback) {
            db.collection('Ids').findAndModify({_id:1},{},{$inc:{admin:1}},function(err, doc_ids) {
                if(err) {throw err; res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});}
                else{
                    var resource = req.body;
                    resource["_id"] = doc_ids.value.admin;
                    db.collection('admin').insert(resource,(error, doc) => {
                        if(error) {throw error; res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});}
                        else res.send(200, true);
                    })
                }
            })
        }
        else {
            res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});
        }
    })
}

exports.getInfo = (req, res) => {
    checkHeaders(req.headers, callback => {
        if(callback) {
            db.collection('info').find({}).toArray((error, doc) => {
                if(error) {throw error; res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});}
                else res.send(200, doc);
            })
        }
        else {
            res.send(400, {error:'Hemos tenido un error, favor intentar más tarde'});
        }
    })
}


function checkHeaders(headers, callback) {
	let adminInfo = headers.authorization.split(':'),
		email = adminInfo[0],
		token = parseInt(adminInfo[1]);
    db.collection('admin').findOne({email:email,token:token}, (error, doc) => {
        if(error) {throw error; callback(false)}
        else if(doc === null) callback(false);
        else callback(true);
    })
}