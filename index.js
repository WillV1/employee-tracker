const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
// const viewEmployees = require('./viewquery.js')



// create the connection information for the sql database
let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Newlife2020!",
    database: "employee_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    startMenu();
});

// function which prompts the user for what action they should take
function startMenu() {
    inquirer
        .prompt({
            name: "searchMenu",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add an employee",
                "Add a department", "Remove an employee", "Update employee role", "Exit"]
        })
        .then(function (answer) {
            // based on their answer, either call the appropriate functions

            switch (answer.searchMenu) {
                case "View all employees":
                    viewEmployee();
                    break;
                case "View all employees by department":
                    viewDepartment();
                    break;
                case "View all employees by manager":
                    viewManager();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Remove an employee":
                    removeEmployee();
                    break;
                case "Update employee role":
                    updateRole();
                    break;
                case "Exit":
                    return;
                    break;
                default:
                    return "Please make a selection";
                    break;
            }
        });
}


function viewEmployee() {

    // let query = "SELECT * FROM employee INNER JOIN role ON (employee.role_id = role.id)";

    let query = "SELECT *";
    query += "FROM ((employee INNER JOIN role ON employee.role_id = role.id)";
    query += "INNER JOIN department ON role.department_id = department.id);"

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);

    });
    startMenu;
}

function viewDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Which department do you want to search?"
        })
        .then(function (answer) {
            var query = "SELECT first_name, last_name, manager_id FROM employee WHERE ?";
            connection.query(query, { department: answer.department }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.table(res[i]);
                }
                startMenu();
            });
        });
}

// function viewManager() {
//     console.log("Deleting all strawberry icecream...\n");
//     connection.query(
//       "DELETE FROM products WHERE ?",
//       {
//         flavor: "strawberry"
//       },
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " products deleted!\n");
//         // Call readProducts AFTER the DELETE completes
//         readProducts();
//       }
//     );
//   }

function addEmployee() {
    inquirer
        .prompt({
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "input",
                message: "What is the employee's role?"
            },
            {
                name: "manager",
                type: "input",
                message: "Who is the employee's manager?"
            })


        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role,
                    manager_id: answer.manager
                },
                function (err) {
                    if (err) throw err;
                    startMenu();
                }
            );
        });
}

// function removeEmployee() {
//     console.log("Deleting all strawberry icecream...\n");
//     connection.query(
//       "DELETE FROM products WHERE ?",
//       {
//         flavor: "strawberry"
//       },
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " products deleted!\n");
//         // Call readProducts AFTER the DELETE completes
//         readProducts();
//       }
//     );
//   }

