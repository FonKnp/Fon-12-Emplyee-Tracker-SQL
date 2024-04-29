const inquirer = require("inquirer");
const mysql = require("mysql2");
// connect to databases
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Dumpling6116",
    database: "employee_tracker"
  },
  console.log(`Connected to the Employee tracker database.`)
);
// initial app start
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
        viewAllDepartments();
        break;
    case "Add Department":
        addDepartment();
        break;
    case "View All Roles":
        viewAllRoles();
        break;
    case "Add Role":
        addRole();
        break;
    case "View All Employees":
        viewAllEmployees();
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
async function viewAllDepartments() {
  try {
      const query = "SELECT * FROM departments";
      const [rows] = await db.query(query);
      console.table(rows);
  } catch (error) {
      console.error(error);
  }
  initialApp();
};
// view all roles
async function viewAllRoles() {
  try {
      const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
      const [rows] = await db.query(query);
      console.table(rows);
  } catch (error) {
      console.error(error);
  }
  initialApp();
};
// view all employees
async function viewAllEmployees() {
  try {
      const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager_name
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id;
      `;
      const [rows] = await db.query(query);
      console.table(rows);
  } catch (error) {
      console.error(error);
  }
  initialApp();
};

async function addDepartment() {
  try {
      const response = await prompt({
          type: "input",
          name: "name",
          message: "What department you want to create?"
      });
      const query = `INSERT INTO departments (department_name) VALUES ("${response.name}")`;
      const res = await db.query(query);

      console.log(`You have successfully added department ${response.name} to the database!`);
      initialApp();;
  } catch (err) {
      console.error(chalk.red("Error adding department:", err));
      initialApp();
  }
};

