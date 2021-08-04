const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

//rota de listagem de users
router.get("/admin/users", adminAuth, (req, res) => {
	User.findAll().then(users => {
		if (users != undefined) {
			res.render("admin/users/index", {users: users});
		} else {
			res.redirect("/");
		}		
	}).catch(erro => {
				console.log("\n*** ERRO *** '"+ erro +"' *** ERRO ***\n");
				res.redirect("/");
	});		
});

//rota da view de criação de usuários
router.get("/admin/users/new", adminAuth, (req, res) => {
	res.render("admin/users/new");
});

//rota de salvamento de usuários no bd
router.post("/users/save", adminAuth, (req, res) => {
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

router.get("/login", (req, res) => {
	res.render("admin/users/login");
});

router.post("/authentication", (req, res) => {
	var mail = req.body.mail;
	var pass = req.body.password;

	User.findOne({
		where: {
			mail: mail
		}
	}).then(user => {
		if (user != undefined) {
			var validation = bcrypt.compareSync(pass, user.password);
			if (validation) {
				req.session.user = {
					id: user.id,
					mail: user.mail, 
					name: user.name
				}
				res.redirect("/admin/articles");
			} else {
				console.log("\n\n ***  Senha incorreta  *** \n\n");
				res.redirect("/login");
			}
		} else {
			console.log("\n\n ***  Usuário não cadastrado  *** \n\n");
			res.redirect("/login");
		}
	}).catch(erro => {
		console.log("\n*** ERRO *** '"+ erro +"' *** ERRO ***\n");
		res.redirect("/");
	});
});

//deslogar admin
router.get("/logout", (req, res) => {
	req.session.user = undefined;
	res.redirect("/");
});

module.exports = router;