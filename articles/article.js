const Sequelize = require("sequelize");
const connection = require("../database/database");

//importação de outro model para fazer o relacionamento
const Category = require("../categories/category");

const Article = connection.define('article', {
	title:{
		type: Sequelize.STRING,
		allowNull: false
	}, slug:{
		type: Sequelize.STRING,
		allowNull: false
	}, body:{
		type: Sequelize.TEXT,
		allowNull: false
	}
});

Category.hasMany(Article); //Uma categoria pode ter muitos artigos
Article.belongsTo(Category); //Um artigo pertence a uma categoria

Article.sync({force: false});

module.exports = Article;