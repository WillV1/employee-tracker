const mysql = require("mysql");


const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Newlife2020!",
    database: "employee_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    viewEmployees();
});

var query = "SELECT * FROM employee INNER JOIN role ON (employee.role_id = role.id)";



function viewEmployees() {

    connection.query(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        viewEmployee();
    });

    function viewEmployee() {
        console.log("Viewing all employees...\n");
        connection.query(query, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(res);
            connection.end();
        });
    }
}

module.exports = viewEmployees