const { client, getAllUsers } = require("./index");

const dropTables = async () => {
  try {
    console.log("Beginning to drop tables...");
    await client.query(`DROP TABLE IF EXISTS users`);
    console.log("Finished dropping tables");
  } catch (error) {
    console.error("There was an error while dropping tables");
    throw error;
  }
};

const createTables = async () => {
  try {
    console.log("Starting to build fresh tables...");
    await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL
    );
  `);
    console.log("Finished building new tables");
  } catch (error) {
    console.error("There was an error while building new tables.");
    throw error;
  }
};

const rebuildDB = async () => {
  try {
    client.connect();
    await dropTables();
    await createTables();
  } catch (error) {
    console.error("There was an error");
    throw error;
  }
};

const testDatabase = async () => {
  try {
    console.log("Beginning database testing...");
    const users = await getAllUsers();
    console.log("Here is a list of users: ", users);
    console.log("Finished testing the database.");
  } catch (error) {
    console.error("There was an error testing the database: ", error);
  }
};

rebuildDB()
  .then(testDatabase)
  .catch(console.error)
  .finally(() => {
    client.end();
  });
