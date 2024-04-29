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
  try {
    const [rows] = await db.query('SELECT * FROM departments');
    console.table(rows);
  } catch (err) { 
    console.error(err); 
  }
  startApp();
}

// view all roles
async function allRoles() {
  try {
    const [rows] = await db.query('SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id');
    console.table(rows);
  } catch (err) { 
    console.error(err); 
  }
  startApp();
}


// view all employees
async function allEmployees() {
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
  } catch (err) { 
    console.error(err); 
  }
  startApp();
};

//add department
async function addDepartment() {
  try {
    const response = await prompt({
      type: 'input',
      name: 'name',
      message: 'What new department you like to create?'
    });
    await db.query('INSERT INTO departments (department_name) VALUES (?)', [response.name]);
    console.log(`You have successfully added department ${response.name} to the database!`);
    startApp();
  } catch (err) { 
    console.error(err);
    startApp();
  }
}

//add roles
async function addRole() {
  try {
    const [rows] = await db.query('SELECT id AS value, department_name AS name FROM departments');
    const choices = rows.map(row => ({ name: row.name, value: row.value }));
    
    const response = await prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What role would you like to create?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter salary of the role you created:',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department this role will be in?',
        choices: choices,
      },
    ]);
    
    const department = rows.find(row => row.value === response.department);
    await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [response.title, response.salary, response.department]);
    
    console.log(`You have successfully added role ${response.title} to the ${department.name} department with salary ${response.salary} to the database!`);
  } catch (err) {
    console.error(err);
  }
  startApp();
};
  
//add employee
async function addEmployee() {
  try {
      const rolesQuery = 'SELECT id, title FROM roles';
      const [rolesRes] = await db.query(rolesQuery);
      const roles = rolesRes.map(({ id, title }) => ({ name: title, value: id }));

      const managersQuery = 'SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL';
      const [managersRes] = await db.query(managersQuery);
      const managers = managersRes.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

      const response = await prompt([
          {
              type: 'input',
              name: 'firstName',
              message: 'Enter the first name of employee:',
          },
          {
              type: 'input',
              name: 'lastName',
              message: 'Enter the last name of employee:',
          },
          {
              type: 'list',
              name: 'roleId',
              message: 'Select role for employee:',
              choices: roles,
          },
          {
              type: 'list',
              name: 'managerId',
              message: 'Select manager for this employee:',
              choices: [
                  { name: 'None', value: null },
                  ...managers,
              ],
          },
      ]);

      await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, response.roleId, response.managerId]);

      console.log('You have successfully added the employee to the database!');
      startApp();
  } catch (error) {
      console.error('Error adding employee:', error);
      startApp();
  }
};
