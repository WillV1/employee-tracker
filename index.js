const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

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
                "Add a Department", "Add a Role", "Remove an Employee", "Remove a Role", "Remove a Department", "Update Employee Role", "Exit"]
        })
        .then(function (answer) {
            // based on their answer, call the appropriate function

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
                case "Remove a Role":
                    removeRole();
                    break;
                case "Remove a Department":
                    removeDepartment();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Exit":
                    console.log("Goodbye!");
                    connection.end();
                    break;
            }
        });
}


function viewEmployee() {

    let query = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, 
    role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name , " ", manager.last_name) 
    AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department 
    ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });

}

// //How to get table to work?

function viewDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "What department do you want to search by?"
        })
        .then(function (answer) {

            let query = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, 
    role.title AS title FROM employee JOIN role 
    ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE ?`;

            connection.query(query, { name: answer.department }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.table(res[i].id + " " + res[i].first_name + " " + res[i].last_name + " " + res[i].title);
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
            message: "What role do you want to search by?"
        })
        .then(function (answer) {

            var query = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, 
        role.title AS title, role.salary AS salary FROM employee JOIN role 
        ON employee.role_id = role.id WHERE ?`;

            connection.query(query, { title: answer.role }, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.table([res[i].id + " " + res[i].first_name + " " + res[i].last_name + " " + res[i].title + " " + res[i].salary]);
                }
                startMenu();
            });
        });
}

function addEmployee() {

    let employee = {};

    connection.query(`SELECT employee.id first_name, last_name, role_id, role.title, manager_id FROM employee 
    JOIN role ON employee.role_id = role.id`,

        function (err, res) {
            if (err) throw err;

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
                        type: "list",
                        message: "What is the employee's role?",
                        choices: function () {
                            roleArray = []
                            for (var i = 0; i < res.length; i++) {
                                roleArray.push({name: res[i].title, value: res[i].role_id});
                            }
                            return roleArray;
                        }
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: function () {
                            if (employee.manager_id === employee.id) {
                                managerArray = []
                                managerArray.push("None")
                                for (var i = 0; i < res.length; i++) {
                                    managerArray.push(res[i].first_name + '' + res[i].last_name);
                                }
                                return managerArray;
                            
                            }
                        }
                    }
                ])

                .then(function (answer) {
                    console.log(answer)
                    if(answer.manager === "None"){
                        answer.manager = null}
                    connection.query(
                        `INSERT INTO employee SET ?`,
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
connection.query(`SELECT id, department.name FROM department`, function (err, res) {
                        if (err) throw err;

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
                type: "list",
                message: "Which department to add the role?",
                choices: function () {
                    departmentArray = []
                    for (var i = 0; i < res.length; i++) {
                        departmentArray.push({ name: res[i].name, value: res[i].id});
                    }
                    console.log(departmentArray)
                    return(departmentArray);                       
                }

            }
        ])
    .then(function (answer) {
        console.log(answer)
        connection.query(
            `INSERT INTO role SET ?`,
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
    })
}

function removeEmployee() {
    connection.query("SELECT first_name, last_name, role_id, manager_id FROM employee", function (err, res) {
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
                console.log(answer);
                connection.query(
                    "DELETE FROM employee WHERE ? AND ?",
                    [{
                        first_name: answer.remove.split(" ")[0]
                    },
                    {
                        last_name: answer.remove.split(" ")[1]
                    }],

                    function (err) {
                        if (err) throw err;
                        startMenu();
                    }
                );
            });
    });
}

function removeRole() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "removeRole",
                type: "list",
                message: "Which role would you like to remove?",
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                }
            })

            .then(function (answer) {
                console.log(answer);
                connection.query(
                    "DELETE FROM role WHERE ?",
                    {
                        title: answer.removeRole
                    },
                    function (err) {
                        if (err) throw err;
                        startMenu();
                    }
                );
            });
    });
}

function removeDepartment() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "removeDepartment",
                type: "list",
                message: "Which department would you like to remove?",
                choices: function () {
                    var departmentArray = [];
                    for (var i = 0; i < res.length; i++) {
                        departmentArray.push(res[i].name);
                    }
                    return departmentArray;
                }
            })

            .then(function (answer) {

                connection.query(
                    "DELETE FROM department WHERE ?",
                    {
                        name: answer.removeDepartment
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
    
    connection.query(`SELECT role.id, role.title FROM role `, function (err, res) {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                    name: "employee",
                    type: "input",
                    message: "Which employee would you like to update?"
                    // choices: function () {
                    //     var employeeArray = []
                    //     for (var i = 0; i < res.length; i++) {
                    //         employeeArray.push(res[i].first_name + " " + res[i].last_name);
                    //     }
                    //     return employeeArray;
                    // }
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: function () {
                        roleArray = []
                        for (var i = 0; i < res.length; i++) {
                            roleArray.push({name: res[i].title, value: res[i].id});
                        }
                        console.log(roleArray)
                        return roleArray;
                    }
                },
                ])
                .then(function (answer) {
                    console.log(answer);
                    connection.query(
                        `UPDATE employee SET ? WHERE ? AND ?`,
                        [
                            {
                                role_id: answer.role
                            },
                            {
                                first_name: answer.employee.split(" ")[0]
                            },
                            {
                                last_name: answer.employee.split(" ")[1]
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;

                            startMenu();
                        }

                    );
                });
        });
}