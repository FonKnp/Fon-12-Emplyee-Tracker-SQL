const inquirer = require("inquirer");
const mysql = require("mysql2");
const Table = require("cli-table3");
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
  try {
    const response = await inquirer.prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "Add a Department",
        "View All Roles",
        "Add A Role",
        "View All Employees",
        "Add An Employee",
        "Update An Employee Role",
        "Quit"
      ]
    });

    switch (response.options) {
      case "View All Departments":
        viewAllDepartments();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add A Role":
        addRole();
        break;
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add An Employee":
        addEmployee();
        break;
      case "Update An Employee Role":
        updateEmployeeRole();
        break;
      case "Quit":
        console.log("Thank you for using the Employee Manager App!");
        db.end(); // Close the database connection
        break;
    }
  } catch (error) {
    console.error("An error occurred:", error);
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
      initialApp();
  } catch (err) {
      console.error("Error adding department:", err);
      initialApp();
  }
};

initialApp();