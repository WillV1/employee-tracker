var mysql = require("mysql");
var inquirer = require("inquirer");

// // create the connection information for the sql database
// var connection = mysql.createConnection({
//   host: "localhost",

//   // Your port; if not 3306
//   port: 3306,

//   // Your username
//   user: "root",

//   // Your password
//   password: "",
//   database: "greatBay_DB"
// });

// // connect to the mysql server and sql database
// connection.connect(function(err) {
//   if (err) throw err;
//   // run the start function after the connection is made to prompt the user
//   start();
// });

// function which prompts the user for what action they should take
function startMenu() {
  inquirer
    .prompt({
      name: "searchMenu",
      type: "list",
      message: "What would you like to do?",
      choices: ["View all employees", "View all departments", "View all roles", "View employees by department", "Add an employee", 
      "Add a department", "Add a role", "Update employee role", "Exit" ]
    })
    .then(function(answer) {
      // based on their answer, either call the appropriate functions
      let response = answer.searchMenu;
      
      switch (response) {
        case "View all employees":
            viewEmployees();
        break;
        case "View all departments":
            viewDepartments();
        break;
        case "View all roles":
            viewRoles();
        break;
        case "View employees by department":
            viewEmployeesDepartment();
        break;
        case "Add an employee":
            addEmployee();
        break;
        case "Add a department":
            addDepartment();
        break;
        case "Add a role":
            addRole();
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
startMenu()
