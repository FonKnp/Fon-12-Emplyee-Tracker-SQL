const mysql = require('mysql2/promise');
const { prompt } = require('inquirer');
// connect to databases
let db;

(async () => {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Dumpling6116',
            database: 'employee_tracker',
        });
        console.log('Connected to the Employee Manager database.');
        startApp();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

// initial app start
async function startApp() {
  try {
      const response = await prompt({
          type: 'list',
          name: 'options',
          message: 'What would you like to do? Choose below',
          choices: [
              'View All Departments',
              'Add Department',
              'View All Roles',
              'Add Role',
              'View All Employees',
              'Add Employee',
              'Update Employee Role',
              'Exit'
          ],
      });

      switch (response.options) {
          case 'View All Departments':
              await allDepartment();
              break;
          case 'Add Department':
              await addDepartment();
              break;
          case 'View All Roles':
              await allRoles();
              break;
          case 'Add Role':
              await addRole();
              break;
          case 'View All Employees':
              await allEmployees();
              break;
          case 'Add Employee':
              await addEmployee();
              break;
          case 'Update Employee Role':
              await updateRole();
              break;
          case 'Exit':
              console.log('Exited successfully! Goodbye!');
              process.exit();
      }
  } catch (error) {
      console.error('Error:', error);
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