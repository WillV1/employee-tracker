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
            choices: ["View all Employees", "View all Employees by Department", "View all Employees by Role", "Add an Employee",
                "Add a Department", "Add a Role", "Remove an Employee", "Update Employee Role", "Exit"]
        })
        .then(function (answer) {
            // based on their answer, either call the appropriate functions

            switch (answer.searchMenu) {
                case "View all Employees":
                    viewEmployee();
                    break;
                case "View all Employees by Department":
                    viewDepartment();
                    break;
                case "View all Employees by Role":
                    viewRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Remove an Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
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
    query += "INNER JOIN department ON role.department_id = department.id)";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });

}


function viewDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Which department do you want to search?"
        })
        .then(function (answer) {
            let query = "SELECT *";
            query += "FROM ((department INNER JOIN role ON department.id = role.department_id)";
            query += "INNER JOIN employee ON role.id = employee.role_id)";

            connection.query(query, { department: answer.department }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.table(res[i]);
                }
                startMenu();
            });
        });
}

function viewRole() {
    inquirer
        .prompt({
            name: "role",
            type: "input",
            message: "Which role do you want to search?"
        })
        .then(function (answer) {
            var query = "SELECT first_name, last_name, department_id, manager_id FROM employee WHERE ?";
            connection.query(query, { role: answer.role }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.table(res[i]);
                }
                startMenu();
            });
        });
}

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

function addDepartment() {
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "What is the name of the new department?"
        })


        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.departmentName,
                },
                function (err) {
                    if (err) throw err;
                    startMenu();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "What is the name of the role?"
        },
            {
                name: "salary",
                type: "input",
                message: "What is the role's salary?"
            },
            {
                name: "department",
                type: "input",
                message: "Which department to add the role?"
            })


        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.name,
                    salary: answer.salary,
                    department_id: answer.department,
                },
                function (err) {
                    if (err) throw err;
                    startMenu();
                }
            );
        });
}

function removeEmployee() {

    inquirer
        .prompt({
            name: "remove",
            type: "list",
            message: "Which employee would you like to remove?",
            choices: []
        })

    connection.query(
        "DELETE FROM products WHERE ?",
        {
            flavor: "strawberry"
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products deleted!\n");
            // Call readProducts AFTER the DELETE completes
            readProducts();
        }
    );
}

// function updateRole() {

//     inquirer
//         .prompt({
//             name: "name",
//             type: "input",
//             message: "Which employee would you like to update?",
//             choices: []
//             },
//             {
//                 name: "role",
//                 type: "input",
//                 message: "What is the employee's new role?"
//             })

//     var query = connection.query(
//       "UPDATE products SET ? WHERE ?",
//       [
//         {
//           quantity: 100
//         },
//         {
//           flavor: "Rocky Road"
//         }
//       ],
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " products updated!\n");
//         // Call deleteProduct AFTER the UPDATE completes
//         connection.end();
//       }

//     );

//   }