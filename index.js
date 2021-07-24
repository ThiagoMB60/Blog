const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//view engine
app.set('view engine', 'ejs');

//body-parser
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

//Static
app.use(express.static('public'));

//database
connection.authenticate().then(() =>{
	console.log("DATABASE CONNECTED!!");
}).catch((error) => {
	console.log(error);
})

//rotas
app.get("/", (req, res) => {
	res.render("index");
})

//start da aplicação
app.listen(8080, () =>{
	console.log("SERVER ON***");
})