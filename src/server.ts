import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from "inquirer";
import { error } from 'console';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// inquirer -> start of the application : options be like
// view all depts, view all roles, view all empa,
//add a dept 
// add a role, and add an emp , update emp role


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

  app.get('/api/departments',(_req,res) => {
   
    const sql = `SELECT name,id FROM department`;

   pool.query(sql,(err:Error,result: QueryResult) => {

    if(err){
        res.status(500).json({error:err.message})
        return;
    }
    const {rows} = result;
    res.json({
        message : 'success',
        data : rows
    });//res.json end
   });//pool.query end

  });//app.get end 
    
}

//select query-> view all roles
function viewAllRoles():void{
app.get('/api/roles',(_req,res) => {

   const sql = `SELECT id,title,department, salary `;

    pool.query(sql,(err:Error,result:QueryResult) =>{

        if(err){
            res.status(500).json({error:err.message});
        }
        const {rows} = result;
        res.json({
            message : 'success',
            data : rows
        });//end res.json
    });//end pool.query
});//end app.get
}

//select query-> view all employees
function viewAllEmployees():void{
    app.get('api/employees',(_req,res) =>{
        
       const sql =`SELECT `;// employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

       pool.query(sql,(err: Error,result : QueryResult) =>{

            if(err){
                res.status(500).json({error:err.message});
            } 
            const {rows} = result;
            res.json({
                message : 'success',
                data : rows
            });// end res.json       
       });//end pool.query
    });//end app.get
}

// Default response for any other request (Not Found)
app.use((_req, res) => {
    res.status(404).end();
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  