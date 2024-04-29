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
async function allDepartment() {
  const [rows] = await db.query('SELECT * FROM departments');
  console.table(rows);
  startApp();
}

// view all roles
async function allRoles() {
  const [rows] = await db.query('SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id');
  console.table(rows);
  startApp();
}


// view all employees
async function allEmployees() {
  const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager_name
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id;
      `;
  const [rows] = await db.query(query);
  console.table(rows);
  startApp();
};

startApp();