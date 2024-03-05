const mysql = require("mysql2");
const config = require("../config");
const pool = mysql.createPool(config.db);
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to the database!");
});
module.exports = {
    getUsers: (callback) => {
        pool.query("SELECT * FROM account", callback);
    },
    addUser: (userData, callback) => {
        pool.query(
            `INSERT INTO account (username, password) VALUES ('${userData.username}', '${userData.password}')`,
            callback
        );
    },
};
