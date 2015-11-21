DROP TABLE if exists users;

CREATE TABLE users (
  uid SERIAL,
  fname VARCHAR(50),
  lname VARCHAR(50),
  pass VARCHAR(25),
  dob INT,
  PRIMARY KEY (uid)
  );

INSERT INTO users VALUES (default, 'John', 'Doe', 'xxxx', 27);
INSERT INTO users VALUES (default, 'Jane', 'Doe', 'yyyy', 28);
INSERT INTO users VALUES (default, 'Bill', 'Flood', 'aaaa', 29);
INSERT INTO users VALUES (default, 'Veb', 'Nordhagen', 'bbbb', 30);
INSERT INTO users VALUES (default, 'Hazel', 'Nutting', 'cccc', 4);
INSERT INTO users VALUES (default, 'Caleb', 'Manu', 'dddd', 7);
INSERT INTO users VALUES (default, 'Aiden', 'Hall', 'eeee', 19);