const sequelize = require("sequelize");
const connection = new sequelize('blog', 'root', '12345', {
	host: 'localhost',
	dialect: 'mysql'
});

module.exports = connection;