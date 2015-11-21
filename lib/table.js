// Creates a table for the database
var pg = require('pg');
var connstr = 'postgres://whxrsbxv:lY_KNFCH8xQh8BRfqC89HQTDS9RiEir_' + 
              '@pellefant.db.elephantsql.com:5432/whxrsbxv';
var client = new pg.Client(connstr);
client.connect();

client.query('DROP TABLE if exists users');
client.query(
  'CREATE TABLE users(' +
    'uid SERIAL PRIMARY KEY, ' +
    'fname VARCHAR(50), ' +
    'lname VARCHAR(50), ' +
    'pass VARCHAR(30), ' +
    'dob VARCHAR(18))'
);