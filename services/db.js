const mysql = require("mysql2/promise");
const config = require("../config");

// const config = {
//   db: {
//     /* don't expose password or any sensitive info, done only for demo */
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "prog",
//   },
//   listPerPage: 10,
// };

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
