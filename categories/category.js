const sequelize = require("sequelize");
const connection = require("../database/database");

const category = connection.define('category', {
	title:{
		type: sequelize.STRING,
		allowNull: false
	}, slug:{
		type: sequelize.STRING,
		allowNull: false
	}
});

category.sync({force: false});

module.exports = category;