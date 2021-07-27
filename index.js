const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//importação de rotas
const categoriesController = require("./categories/catagoriesController");
const articlesController = require("./articles/articlesController");

//importação dos arquivos referente as tabelas e relacionamentos do banco de dados
const article = require("./articles/article");
const catagory = require("./categories/category");

//view engine
app.set('view engine', 'ejs');

//body-parser para pegar os dados do formulário
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

//Static
app.use(express.static('public'));

//database
connection.authenticate().then(() =>{
	console.log("DATABASE CONNECTED!!");
}).catch((error) => {
	console.log(error);
});

//uso de rotas importadas
app.use("/", categoriesController);
app.use("/", articlesController);

//rota principal
app.get("/", (req, res) => {
	res.render("index");
});

//start da aplicação
app.listen(8080, () =>{
	console.log("SERVER ON***");
});