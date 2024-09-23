import express from 'express';
import { pool, connectToDb } from './connection.js';
import inquirer from "inquirer";
await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Function to fetch managers from the database
// async function getManagers() {
//     try {
//       const res = await pool.query(
//         `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NULL`
//       );
//       return res.rows.map(manager => ({ name: manager.name, value: manager.id }));
//     } catch (error) {
//       console.error('Error fetching managers:', error);
//       return [];
//     }
//   }
// inquirer -> start of the application : options be like
function startApp() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update employee role',
                'Exit'
            ]
        }
    ])
        .then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                pool.end();
                console.log('Thank You for Using Employee Tracker App');
                process.exit();
        }
    });
}
//select query-> view all departments
function viewAllDepartments() {
    //   app.get('/api/departments',(_req,res) => {
    const sql = `SELECT name,id FROM department`;
    pool.query(sql, (err, result) => {
        if (err) {
            // res.status(500).json({error:err.message})
            console.error('Error fetching departments:', err.message);
            return startApp();
            ;
        }
        console.table(result.rows);
        startApp();
        // const {rows} = result;
        // res.json({
        //     message : 'success',
        //     data : rows
        // });//res.json end
    }); //pool.query end
    //   });//app.get end 
}
//select query-> view all roles
function viewAllRoles() {
    // app.get('/api/roles',(_req,res) => {
    const sql = `SELECT id,title,department_id, salary FROM role `;
    pool.query(sql, (err, result) => {
        if (err) {
            // res.status(500).json({error:err.message});
            console.error("Error fetching  Roles!!", err.message);
        }
        // const {rows} = result;
        // res.json({
        //     message : 'success',
        //     data : rows
        // });//end res.json
        // result.rows.forEach(row =>{
        // console.log(`ID : ${row.id} | Title : ${row.title} | Salary : ${row.salary} | Department ID : ${row.department_id}`);
        console.table(result.rows);
        startApp();
        // })
    }); //end pool.query
    // });//end app.get
}
//select query-> view all employees
function viewAllEmployees() {
    // app.get('api/employees',(_req,res) =>{
    const sql = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`; // employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    pool.query(sql, (err, result) => {
        if (err) {
            // res.status(500).json({error:err.message});
            console.error("Error fetching Employees ", err.message);
            startApp();
        }
        console.table(result.rows);
        startApp();
        // const {rows} = result;
        // res.json({
        //     message : 'success',
        //     data : rows
        // });// end res.json       
    }); //end pool.query
    // });//end app.get
}
// add a department
//enter the name of the department and that department is added to the database
function addDepartment() {
    // app.post('/add-department',async(req,res) =>{
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department : ',
            validate: input => input ? true : 'Department name cannot be empty'
        }
    ]).then(async (answer) => {
        const { name } = answer;
        try {
            const result = await pool.query('INSERT INTO department (name) VALUES ($1)  RETURNING * ', [name]);
            console.log('Department added successfully : ', result.rows[0]);
            startApp();
        }
        catch (err) {
            console.error('Failed to add department:');
            startApp();
        }
    }); //end then im=nquirer
    // });
}
async function getDepartments() {
    try {
        const res = await pool.query('SELECT id, name FROM department');
        return res.rows.map(dept => ({ name: dept.name, value: dept.id }));
    }
    catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
}
//add a role
//enter the name, salary, and department for the role and that role is added to the database
async function addRole() {
    // app.post('/add-role',async(req,res)=>{
    const departments = await getDepartments();
    // Check if departments is an array and has elements
    if (!Array.isArray(departments) || departments.length === 0) {
        console.log('No departments found. Please add a department first.');
        return startApp();
    }
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the role : ',
            validate: input => input ? true : 'Role cannot be empty'
        },
        {
            name: 'department',
            type: 'list',
            choices: departments
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter salary : '
        }
    ]).then(async (answers) => {
        const { name, salary, department } = answers;
        try {
            // const deptResult = await pool.query('SELECT id FROM department WHERE name = $1',[department]);
            // if (deptResult.rows.length === 0) {
            //     console.error("Deparment not found!")
            //     return startApp();
            //   }
            //   const departmentId = deptResult.rows[0].id;
            const result = await pool.query(`INSERT INTO role (title, salary, department_id) VALUES($1,$2,$3)  RETURNING * `, [name, salary, department]);
            console.log("Role added Successfully : ", result.rows[0]);
            startApp();
        }
        catch (err) {
            console.error("Role cannot be added", err.message);
            startApp();
        }
    });
    // });
}
// add an employee
//enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    // app.post('/add-employee',async(req,res) => {
    inquirer.prompt([
        {
            name: 'fName',
            type: 'input',
            message: 'Enter the first name : ',
            validate: input => input ? true : 'Please enter the first name'
        },
        {
            name: 'lName',
            type: 'input',
            message: 'Enter the Last Name : ',
            validate: input => input ? true : 'Please enter the last name'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Enter role : ',
            choices: ['HR Manager', 'HR Specialist', 'Software Engineer', 'Engineering Manager', 'Sales Representative', 'Sales Manager', 'Marketing Coordinator', 'Marketing Manager'],
        },
        {
            name: 'manager',
            type: 'input',
            message: 'Enter the name of the manager : '
        }
    ]).then(async (answers) => {
        try {
            const { fName, lName, role, manager } = answers;
            const roleResult = await pool.query('SELECT id FROM role WHERE title = $1', [role]);
            if (roleResult.rows.length === 0) {
                console.error('Role Not Found');
            }
            const roleId = roleResult.rows[0].id;
            // Get the manager ID if manager is provided
            let managerId = null;
            if (manager) {
                const managerNames = manager.split(' ');
                if (managerNames.length < 2) {
                    console.error('Please provide both first and last name of the manager.');
                    return startApp();
                }
                const managerResult = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', manager.split(' '));
                if (managerResult.rows.length === 0) {
                    console.error('Manager not found');
                    startApp();
                }
                managerId = managerResult.rows[0].id;
                await pool.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1,$2,$3,$4)  RETURNING * `, [fName, lName, roleId, managerId]);
                console.log('Employee added successfully');
                startApp();
            }
        }
        catch (err) {
            console.error("Failed to add employee'");
            startApp();
        }
    });
    // })
}
//update an employee role
//prompted to select an employee to update and their new role and this information is updated in the database 
function updateEmployeeRole() {
    // app.put('/update-employee', async (req,res) => {
    inquirer.prompt([
        {
            name: 'employeeId',
            type: 'input',
            message: 'Enter the ID of the employee you want to update:',
            validate: input => !isNaN(parseInt(input)) ? true : 'Please enter a valid number'
        },
        {
            name: 'newRoleId',
            type: 'input',
            message: 'Enter the new role ID:',
            validate: input => !isNaN(parseInt(input)) ? true : 'Please enter a valid number'
        }
    ]).then(async (answers) => {
        const { employeeId, newRoleId } = answers;
        try {
            const employeeCheck = await pool.query('SELECT * FROM employee WHERE id = $1', [employeeId]);
            if (employeeCheck.rows.length === 0) {
                console.error('Employee not found');
                startApp();
            }
            const roleCheck = await pool.query('SELECT * FROM role WHERE id = $1', [newRoleId]);
            if (roleCheck.rows.length === 0) {
                console.error('Role not found');
                return startApp();
            }
            //update
            const sql = 'UPDATE employee SET role_id = $1 WHERE id =$2';
            const result = await pool.query(sql, [newRoleId, employeeId]);
            console.log('Employee role updated successfully:', result);
            startApp();
        }
        catch (err) {
            console.error('Failed to update employee role');
        }
    });
    // })
}
startApp();
// Default response for any other request (Not Found)
app.use((_req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
