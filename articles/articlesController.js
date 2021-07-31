const express = require("express");
const router = express.Router();
const category = require("../categories/category");
const article = require("./article");
const slugify = require("slugify");

//listar artigos
router.get("/admin/articles",(req, res) =>{
	article.findAll({
		include: [{model: category}]
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
			article.destroy({
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
	category.findAll().then(categories =>{
		res.render("admin/articles/new", {categories: categories});
	});
});

//salvar novos artigos
router.post("/articles/save", (req, res) => {
	var title = req.body.title;
	var body = req.body.body;
	var category = req.body.category;

	article.create({
		title: title,
		slug: slugify(title),
		body: body,
		categoryId: category
	}).then(() => {
		res.redirect("/admin/articles");
	});
});

module.exports = router;