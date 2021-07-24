const sequelize = require("sequelize");
const connection = require("../database/database");

//importação de outro model para fazer o relacionamento
const category = require("../categories/category");

const article = connection.define('article', {
	title:{
		type: sequelize.STRING,
		allowNull: false
	}, slug:{
		type: sequelize.STRING,
		allowNull: false
	}, body:{
		type: sequelize.TEXT,
		allowNull: false
	}
});

category.hasMany(article); //Uma categoria pode ter muitos artigos
article.belongsTo(category); //Um artigo pertence a uma categoria

article.sync({force: false});

module.exports = article;