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
const viewAllDepartments = function() {
  db.query("SELECT * FROM departments", (err, res) => {
    try {
      if (err) throw err;
      const table = new Table({
        head: ["ID", "Department Name"]
      });
      res.forEach(row => {
        table.push([row.id, row.name]);
      });
      console.log(table.toString());
      initialApp();
    } catch (error) {
      console.error(error);
      initialApp();
    }
  });
};
// view all roles
const viewAllRoles = function() {
  db.query(
    `SELECT roles.id, roles.title, departments.department_name, roles.salary
     FROM roles
     INNER JOIN departments ON roles.department_id = department.id`,
    (err, res) => {
      try {
        if (err) throw err;
        const table = new Table({
          head: ["ID", "Job Title", "Department Name", "Salary"]
        });
        res.forEach(row => {
          table.push([row.id, row.title, row.department_name, row.salary]);
        });
        console.log(table.toString());
        initialApp();
      } catch (error) {
        console.error(error);
        initialApp();
      }
    }
  );
};
// view all employees

initialApp();