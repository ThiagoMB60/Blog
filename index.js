const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//importação de rotas
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

//importação dos arquivos referente as tabelas e relacionamentos do banco de dados
const Article = require("./articles/article");
const Category = require("./categories/category");

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
	Article.findAll({
		order: [
			['id', 'DESC']
		],
		limit: 4
	}).then(articles => {
		Category.findAll().then(categories => {
			res.render("index", {articles: articles, categories: categories});
		});		
	});	
});

//rota de cada artigo
app.get("/:slug", (req, res) => {
	var slug = req.params.slug;

	Article.findOne({
		where: {
			slug: slug
		}
	}).then(article => {
		if (article == undefined) {
			res.redirect("/");
		}else{
			Category.findAll().then(categories => {
				res.render("article", {article: article, categories: categories});
			});		
		}		
	}).catch(error => {
		res.redirect("/");
	});	
});

//rota de exibição dos artigos por categoria
app.get("/category/:slug", (req, res) => {
	var slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: [{model: Article}]
	}).then(category => {
		if(category != undefined) {
			Category.findAll().then(categories => {
				res.render("index", {articles: category.articles, categories: categories})
			});
		}else{
			res.redirect("/");
		}
	}).catch(erro => {
		console.log("\n"+"\n" + erro + "***************        Caiu no catch          ****************" + "\n"+"\n");
		res.redirect("/");		
	});
});

//start da aplicação
app.listen(8080, () =>{
	console.log("SERVER ON***");
});