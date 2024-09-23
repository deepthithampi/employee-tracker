-- Insert departments
INSERT INTO department (name)
VALUES 
  ('Human Resources'),
  ('Engineering'),
  ('Sales'),
  ('Marketing');

  -- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES
  ('HR Manager', 70000.00, 1),
  ('HR Specialist', 50000.00, 1),
  ('Software Engineer', 90000.00, 2),
  ('Engineering Manager', 110000.00, 2),
  ('Sales Representative', 60000.00, 3),
  ('Sales Manager', 85000.00, 3),
  ('Marketing Coordinator', 55000.00, 4),
  ('Marketing Manager', 80000.00, 4);

  -- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),          -- HR Manager
  ('Jane', 'Smith', 2, 1),           -- HR Specialist, reports to HR Manager
  ('Alice', 'Johnson', 3, 4),        -- Software Engineer, reports to Engineering Manager
  ('Bob', 'Brown', 4, NULL),         -- Engineering Manager
  ('Charlie', 'Davis', 5, 6),        -- Sales Representative, reports to Sales Manager
  ('Eve', 'White', 6, NULL),         -- Sales Manager
  ('Grace', 'Kim', 7, 8),           -- Marketing Coordinator, reports to Marketing Manager
  ('Helen', 'Taylor', 8, NULL);     -- Marketing Manager