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
  const response = await inquirer.prompt( [ {
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
    ]
  )
  switch (response.options) {
    case "View All Departments":
        allDepts();
        break;
    case "Add Department":
        addDept();
        break;
    case "View All Roles":
        allRoles();
        break;
    case "Add Role":
        addRole();
        break;
    case "View All Employees":
        allEmployees();
        break;
    case "Add Employee":
        addEmployee();
        break;
    case "Update Employee Role":
        updateRole();
        break;
    case "Exit":
        console.log(chalk.magenta("Exited successfully! Goodbye!"));
        process.exit();
  }
};

// view all table from departments
async function deptAll() {
  try {
      const query = "SELECT * FROM departments";
      const [rows] = await db.query(query);
      console.table(rows);
  } catch (error) {
      console.error(error);
  }
  initialApp();
};

