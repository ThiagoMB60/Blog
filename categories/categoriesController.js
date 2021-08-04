const express = require("express");
const router = express.Router();
const Category = require("./category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

//criação de categoria
router.get("/admin/categories/new", adminAuth, (req, res) => {
	res.render("admin/categories/new");
});

//salvando categorias
router.post("/categories/save", adminAuth, (req, res) => {
	var title = req.body.title;
	if (title != undefined) {
		Category.create({
			title: title,
			slug: slugify(title)
		}).then(() => {
			res.redirect("/admin/categories");
		});
	}else{
		res.redirect("/admin/categories/new");
	}
});

//exibir lista de categorias admin
router.get("/admin/categories", adminAuth, (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/categories/index.ejs", {categories:categories});
	});	
});

//deletar categoria
router.post("/categories/delete", adminAuth, (req, res) =>{
	var id = req.body.id;
	if(id != undefined){
		if(isNaN(id)){
			res.redirect("/admin/categories");
		}else{
			Category.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect("/admin/categories");
			});
		}
	}else{
		res.redirect("/admin/categories");
	}
});

//editar categoria
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
	var id = req.params.id;
	if (isNaN(id)) {
		res.redirect("/admin/categories");
	}
	Category.findByPk(id).then(category => {
		if (category == undefined) {
			res.redirect("/admin/categories");			
		}else{
			res.render("admin/categories/edit", {category: category});
		}
	}).catch(erro => {
		res.redirect("/admin/categories");
	});
});

//atualização de categoria admin
router.post("/categories/update", adminAuth, (req, res) => {
	var id = req.body.id;
	var title = req.body.title;

	Category.update({title: title, slug: slugify(title)}, {
		where: {
			id: id
		}
	}).then(() => {
		res.redirect("/admin/categories");
	});
});

module.exports = router;