const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

const getAllUsers = async() => {
  const { rows } = await client.query(`SELECT id, username FROM users;`);
  return rows;
}

const createUser = ({username, password}) => {
  try {
    const result = await client.query
  }
}

module.exports = { client, getAllUsers };