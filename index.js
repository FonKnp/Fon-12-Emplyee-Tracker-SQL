const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Dumpling6116",
    database: "employee_tracker"
  },
  console.log(`Connected to the Employee tracker database.`)
);

const initialApp = async function() {
  const response = await inquirer.prompt( {
    type: "list",
    name: "options",
    message: "What would you like to do?",
    Choices: [
      "View All Departments",
      "Add Department",
      "View All Roles",
      "Add Role",
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "Quit"
    ],
  }
)};

