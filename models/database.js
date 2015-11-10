//creates table
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE login_table(id SERIAL PRIMARY KEY, username VARCHAR(20) not null, password VARCHAR(20) not null, email VARCHAR(30) not null, fname VARCHAR(20) not null, lname VARCHAR(20) not null, university VARCHAR(15) not null)');
query.on('end', function() { client.end(); });