// Import dependencies (express - web server, better-sqlite3 - db driver)
import express from 'express';
import betterSqlite3 from 'better-sqlite3';

// Create a web server and start it - serve a html file
const app = express();
app.use(express.static('www'));
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

// Necessary setting in order to be able to read request bodies
app.use(express.json());

// Create a REST-api that communicates with the database
// db -> my connection to the database
const db = betterSqlite3('./database/owners-and-pets.sqlite3');

// Normally we have 5 basic routes per database table

// A list of all petowners - C(R)UD
app.get('/api/pet-owners', (req, res) => {
  // prepare the database statement if want to use
  const preparedStatement = db.prepare('SELECT * FROM pet_owners');
  // run the database statement
  const result = preparedStatement.all();
  // return as json
  res.json(result);
});

// Get one specific pet owner by id - C(R)UD
app.get('/api/pet-owners/:id', (req, res) => {
  // read the route paramater id
  let id = req.params.id;
  // prepare the database statement if want to use
  // here we do things right we create a "parameter" -> ":id"
  const preparedStatement = db.prepare('SELECT * FROM pet_owners WHERE id = :id');
  // run the database statement
  // and now we let the database engine + driver replace the parameter with a value
  // from the user - and it is programmed to do that in a secure way
  // and sanitize the user data from SQL code
  // so we don't have to do that manually!
  const result = preparedStatement.all({ id });
  // return as json
  res.json(result);
});

// Get one specific pet owner by id - C(R)UD
// BAD PROGRAMMING - EXPOSING THE route TO sql injections!!!
app.get('/api/pet-owners-bad/:id', (req, res) => {
  // read the route paramater id
  let id = req.params.id;
  // prepare the database statement if want to use 
  // it's here we go wrong by concatenating the user data straight into a db query!
  const preparedStatement = db.prepare(`SELECT * FROM pet_owners WHERE id = ${id}`);
  // run the database statement
  const result = preparedStatement.all();
  // return as json
  res.json(result);
});

// Create a new row/post in the pet-owners table
// via a REST-api POST-route
app.post('/api/pet-owners', (req, res) => {
  const preparedStatement = db.prepare(`
    INSERT INTO pet_owners (first_name, last_name, email)
    VALUES (:first_name, :last_name, :email)  
  `);
  const result = preparedStatement.run(req.body);
  res.json(result);
});

// Update a row/post in the pet-owners table
// via a REST-api PUT-route
app.put('/api/pet-owners/:id', (req, res) => {
  // read the route paramater id
  let id = req.params.id;
  const preparedStatement = db.prepare(`
    UPDATE pet_owners
    SET ${Object.keys(req.body).map(key => `${key} = :${key}`)}
    WHERE id = :id
  `);
  const result = preparedStatement.run({ ...req.body, id });
  res.json(result);
});

// Delete a row/post from the pet-owners table
// via a REST-api DELETE-route
app.delete('/api/pet-owners/:id', (req, res) => {
  // read the route paramater id
  let id = req.params.id;
  const preparedStatement = db.prepare(`DELETE FROM pet_owners WHERE id = :id`);
  const result = preparedStatement.run({ id });
  res.json(result);
});

// Now we need to create REST-api routes for pets as well...
// (and all other tables if we have any)

// For large databases we offer write code that automatically
// creates routes for all tables

// + we normally restrict access to different routes based on logged in user
// and user role (or extra restrictions for non-logged users / visitor)
// usually base on an ACL table in conjunction with a session or token based
// login system...
