USE LastExam;

CREATE TABLE organizers (
id INT PRIMARY KEY AUTO_INCREMENT, 
user_name VARCHAR(18) UNIQUE NOT NULL, 
password TEXT NOT NULL, 
regTime DATE NOT NULL
);

CREATE TABLE participants (
id INT PRIMARY KEY AUTO_INCREMENT, 
name VARCHAR(25) NOT NULL, 
surname VARCHAR(25) NOT NULL, 
email VARCHAR(30) UNIQUE NOT NULL, 
age INT NOT NULL, 
organizer_id INT NOT NULL
);

INSERT INTO organizers (user_name, password, regTime) VALUES ('sql1', '123', '2022-10-19');
INSERT INTO participants (name, surname, email, age, organizer_id) VALUES ('user1', 'sur1', 'user1@pastas.lt', 100, 1);

SELECT * FROM organizers;
SELECT * FROM participants;



 
 
 