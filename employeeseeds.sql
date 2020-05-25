/* Seeds for SQL table. We haven't discussed this type of file yet */
USE employee_DB;

/* Insert Rows into new table */
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Carter", "Jones", 2, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lauren", "Miller", 3, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Miles", "Standish", 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Amy", "Franks", 4, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ken", "Bear", 5);

INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO department (name)
VALUES ("Operations");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("VP Operations", 110000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 50000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Executive", 80000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Operations Lead", 65000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("VP Sales", 120000, 3);