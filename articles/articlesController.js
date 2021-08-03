const express = require("express");
const router = express.Router();
const Category = require("../categories/category");
const Article = require("./article");
const Slugify = require("slugify");

//listar artigos
router.get("/admin/articles",(req, res) =>{
	Article.findAll({
		include: [{model: Category}]
	}).then((articles) => {
		res.render("admin/articles/index", {articles: articles});
	});	
});

//deletar artigos
router.post("/articles/delete", (req, res) =>{
	var id = req.body.id;
	if(id != undefined){
		if(isNaN(id)){
			res.redirect("/admin/articles");
		}else{
			Article.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect("/admin/articles");
			});
		}
	}else{
		res.redirect("/admin/articles");
	}
});

//criar novos artigos
router.get("/admin/articles/new",(req, res) =>{
	Category.findAll().then(categories =>{
		res.render("admin/articles/new", {categories: categories});
	});
});

//salvar novos artigos
router.post("/articles/save", (req, res) => {
	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;

	Article.create({
		title: title,
		slug: Slugify(title),
		body: body,
		categoryId: category
	}).then(() => {
		res.redirect("/admin/articles");
	});
});

//editar artigos
router.get("/admin/articles/edit/:id", (req, res) => {
	var id = req.params.id;
	Article.findByPk(id).then(article => {
		if (article != undefined) {
			Category.findAll().then(categories => {
				res.render("admin/articles/edit", {categories: categories, article: article});
			});
		}else{
			res.redirect("/admin/articles");
		}
	}).catch(erro => {
		console.log("\n\n" + erro + "\n\n");
		res.redirect("/admin/articles");
	});
});

//rota de atualização de artigos
router.post("/articles/update", (req, res) => {
	var id = req.body.id;
	var body = req.body.body;
	var title = req.body.title;
	var category = req.body.category;

	Article.update({
		categoryId: category,
		title: title,
		body: body,
		slug: Slugify(title)
	},{
		where: {
			id: id
		}
	}).then(() => {
		console.log("*** Atualizado com sucesso ***");
		res.redirect("/admin/articles");
	}).catch(erro => {
		console.log("*** ERRO *** '"+ erro +"' *** ERRO ***");
		res.redirect("/");
	});
});

//rota de paginação de artgos
router.get("/articles/page/:numPage", (req, res) => {
	var page = req.params.numPage;
	var offset = 0;

	if (isNaN(page)) {
		offset = 0;
	}else{
		offset = (parseInt(page)-1) * 4;
	}

	Article.findAndCountAll({
		limit: 4,
		offset: offset,
		order: [
			['id', 'DESC']
		]
	}).then(articles => {
		var next;

		if (offset + 4 >= articles.count) {
			next = false;
		} else {
			next = true;
		}

		var result = {
			page: parseInt(page),
			next: next,
			articles: articles
		}

		Category.findAll().then(categories =>{
			res.render("admin/articles/page", {result: result, categories: categories});			
		})
		.catch(erro => {
			console.log("*** ERRO *** '"+ erro +"' *** ERRO ***");
		res.redirect("/");
		});

	}).catch(erro => {		
		console.log("*** ERRO *** '"+ erro +"' *** ERRO ***");
		res.redirect("/");
	});
});

module.exports = router;