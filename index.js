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
                    console.log("Goodbye!");
                    break;
                default:
                    console.log("Please make a selection");
                    break;
            }
        });
}

//How to change manager_id to manager name?

function viewEmployee() {

    let query = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, 
    role.title AS title, department.name AS department, role.salary AS salary FROM employee JOIN role 
    ON employee.role_id = role.id JOIN department ON role.department_id = department.id`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });

}

// How to get for loop to work?

function viewDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Which department do you want to search?"
        })
        .then(function (answer) {
            let query = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, 
            role.title AS title, department.name AS department, role.salary AS salary FROM employee JOIN role 
            ON employee.role_id = role.id JOIN department ON role.department_id = department.id`;

            connection.query(query, { department_name: answer.department }, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    if (err) throw err;
                    console.table(res[i]);
                }
                startMenu();
            });
        });
}

//How to get for loop to work?

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

//How to add manager name/id?
function addEmployee() {
    inquirer
        .prompt([
            {
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
            }    
        ])


        .then(function (answer) {
            
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
        .prompt([
            {
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
            }
        ])


        .then(function (answer) {
            
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.name,
                    salary: answer.salary,
                    department_id: answer.department
                },
                function (err) {
                    if (err) throw err;
                    startMenu();
                }
            );
        });
}


function removeEmployee() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "remove",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: function () {
                    var employeeArray = [];
                    for (var i = 0; i < res.length; i++) {
                        employeeArray.push(res[i].first_name + " " + res[i].last_name);
                    }
                    return employeeArray;
                }
            })

            .then(function (answer) {
                
                connection.query(
                    "DELETE FROM employee WHERE ?",
                    {
                        first_name, last_name, role_id, manager_id: answer.remove
                    },
                    function (err) {
                        if (err) throw err;
                        startMenu();
                    }
                );
            });
    });
}

function updateRole() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "name",
                type: "input",
                message: "Which employee would you like to update?",
                choices: function () {
                    var employeeArray = [];
                    for (var i = 0; i < res.length; i++) {
                        employeeArray.push(res[i].first_name + " " + res[i].last_name);
                    }
                    return employeeArray;
                }
            },
                {
                    name: "role",
                    type: "input",
                    message: "What is the employee's new role?"
                })

        var query = connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answer.role
                }
            ],
            function (err, res) {
                if (err) throw err;

                startMenu();
            }

        );
    });
}