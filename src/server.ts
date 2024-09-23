import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from "inquirer";


await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


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
                    console.log('Goodbye!');
                    process.exit();
            }
        });
}


// add a department
//enter the name of the department and that department is added to the database

//add a role
//enter the name, salary, and department for the role and that role is added to the database

// add an employee
//enter the employee’s first name, last name, role, and manager, and that employee is added to the database

//update an employee role
//prompted to select an employee to update and their new role and this information is updated in the database 

//select query-> view all departments
function viewAllDepartments():void {

//   app.get('/api/departments',(_req,res) => {
   
    const sql = `SELECT name,id FROM department`;

   pool.query(sql,(err:Error,result: QueryResult) => {

    if(err){
        // res.status(500).json({error:err.message})
        console.error('Error fetching departments:', err.message);
        return startApp(); ;
    }
    console.table(result.rows)
    startApp(); 
    // const {rows} = result;
    // res.json({
    //     message : 'success',
    //     data : rows
    // });//res.json end
   });//pool.query end

//   });//app.get end 
    
}

//select query-> view all roles
function viewAllRoles():void{
// app.get('/api/roles',(_req,res) => {

   const sql = `SELECT id,title,department, salary `;

    pool.query(sql,(err:Error,result:QueryResult) =>{

        if(err){
            // res.status(500).json({error:err.message});
            console.error("Error fetching  Roles!!",err.message)
            startApp(); 
        }
        console.table(result.rows)
        startApp(); 
        // const {rows} = result;
        // res.json({
        //     message : 'success',
        //     data : rows
        // });//end res.json
    });//end pool.query
// });//end app.get
}

//select query-> view all employees
function viewAllEmployees():void{
    // app.get('api/employees',(_req,res) =>{
        
       const sql =`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;// employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

       pool.query(sql,(err: Error,result : QueryResult) =>{

            if(err){
                // res.status(500).json({error:err.message});
                console.error("Error fetching Employees ", err.message);
                startApp();
            } 
            console.table(result.rows)
            startApp();
            // const {rows} = result;
            // res.json({
            //     message : 'success',
            //     data : rows
            // });// end res.json       
       });//end pool.query
    // });//end app.get
}

// add a department
//enter the name of the department and that department is added to the database
function addDepartment(){

    // app.post('/add-department',async(req,res) =>{
    inquirer.prompt([
        {
            name : 'name',
            type : 'input',
            message : 'Enter the name of the department : ',
            validate : input => input ? true : 'Department name cannot be empty'
        }

    ]).then(async (answer)=>{
        const {name} = answer;
        try{
            const result = await pool.query('INSERT INTO department (name) VALUES ($1)  RETURNING * ',[name]);
            console.log('Department added successfully : ',result.rows[0]);
            startApp();
        }catch(err){
            console.error('Failed to add department:');
            startApp();
        }
    });//end then im=nquirer
        
        
    // });

}

//add a role
//enter the name, salary, and department for the role and that role is added to the database
function addRole(){
    // app.post('/add-role',async(req,res)=>{
       
       inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the role : ',
            validate : input => input ? true : 'Role cannot be empty'
        }
    ]).then(async(answers)=>{
        const {name, salary,department} = answers;
        try{
            const deptResult = await pool.query('SELECT id FROM department WHERE name = $1',[department]);
            if (deptResult.rows.length === 0) {
                console.error("Deparment not found!")
                return startApp();
              }
              const departmentId = deptResult.rows[0].id;
              const result = await pool.query(`INSERT INTO role (title, salary, department_id) VALUES($1,$2,$3)  RETURNING * `,[name,salary,departmentId]);
              console.log("Role added Successfully : ",result.rows[0]);
              startApp();
        }catch(err){
            
            console.error("Role cannot be added")
            startApp();
        }
    })
        
        
    // });
}

// Default response for any other request (Not Found)
app.use((_req, res) => {
    res.status(404).end();
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  