INSERT INTO departments (department_name)
VALUES
  ("Executive Board"),
  ("Legal"),
  ("Customer Service"),
  ("Marketing"),
  ("Finance"),
  ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES
  ("Chief Executive Officer", 200000.00, 5);
  ("Legal Manager", 80000.00, 5),
  ("Customer Service Manager", 50000.00, 2),
  ("Marketing Manager", 75000.00, 1),
  ("Finance Manager", 100000.00, 4),
  ("HR Director", 100000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Jonathan", "Roberts", 1, 1),
  ("Lila", "Meghan", 2, 2),
  ("Patrick", "Gold", 3, 3),
  ("Gold", "Roger", 4, 4),
  ("Mashle", "Burnedead", 5, 5),
  ("Sarah", "Moore", 6, 6);