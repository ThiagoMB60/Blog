const express = require("express");
const router = express.Router();
const category = require("./category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
	res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
	var title = req.body.title;
	if (title != undefined) {
		category.create({
			title: title,
			slug: slugify(title)
		}).then(() => {
			res.redirect("/");
		});
	}else{
		res.redirect("/admin/categories/new");
	}
});

router.get("/admin/categories", (req, res) => {
	category.findAll().then(categories => {
		res.render("admin/categories/index.ejs", {categories:categories});
	});	
});

module.exports = router;