CREATE TABLE users (
  id INT PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL
);
INSERT INTO users (name, email, created_at)
VALUES ('Test', 'test@example.com', NOW());

UPDATE users 
SET name = 'test' 
WHERE id = 1;

DELETE FROM users 
WHERE id = 1;

DELETE FROM temporary_logs;

SELECT id, name, email 
FROM users 
WHERE active = 1  
LIMIT 10;