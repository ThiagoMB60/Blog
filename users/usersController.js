const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");

//rota de listagem de users
router.get("/admin/users", (req, res) => {
	res.render("admin/users/index");
});

//rota da view de criação de usuários
router.get("/admin/users/new", (req, res) => {
	res.render("admin/users/new");
});

//rota de salvamento de usuários no bd
router.post("/users/save", (req, res) => {
	var mail = req.body.mail;
	var name = req.body.name;
	var pass = req.body.password;

	User.findOne({
		where: {
			mail: mail
		}
	}).then(user => {
		if (user == undefined) {
			var salt = bcrypt.genSaltSync(10); //incrementar o poder do hash
			var hash = bcrypt.hashSync(pass, salt);

			User.create({
				name: name,
				password: hash,
				mail: mail
			}).then(() => {
				res.redirect("/admin/users");
			}).catch(erro => {
				console.log("\n*** ERRO *** '"+ erro +"' *** ERRO ***\n");
				res.redirect("/");
			});
		} else {
			res.redirect("/admin/users/new");
		}
	}).catch(erro => {
				console.log("\n*** ERRO *** '"+ erro +"' *** ERRO ***\n");
				res.redirect("/");
	});	
});

module.exports = router;