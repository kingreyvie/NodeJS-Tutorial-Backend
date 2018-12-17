//server .js
const express = require ('express');
const server = express();
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const swagger = require('./swagger')

//fetch the json object to our body request
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));

server.use(function(req, res, next){
	//website you wish to allow to connect when we make the UI
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')

	//request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	//request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

	//set true in case using sessions to include cookies
	res.setHeader('Access-Control-Allow-Credentials', true);
	//pass to next layer of middleware
	next();
})

//display hello world
server.get('/hello', (req, res) => {res.send('Hello World')})

//server listening to port 8081
//server.listen('8081', function(){ console.log('Listening to post 8081')})


//database connection
var connection = require('./config/db-mysql')
connection.init((conn)=>{
	//we will place 'server.listen' here
	server.listen('8081', function(){
		console.log('listening to post 8081')
	})
	loadModule(server, conn, function(err, resp){
		if (resp.status == 'success'){
			console.log('-----Main Modules Activated-----')
		}
	})
})

function loadModule (server, dbConnection, callback){
	var modules = require('./user/api')

	modules.init(server, dbConnection)
	callback (null, {status: 'success'})
}
