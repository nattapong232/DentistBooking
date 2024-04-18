const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Shelves_04654",
  database: "vacCenter",
});

module.exports = connection;
