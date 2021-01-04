const mysql = require("mysql");
const config = require("./config");
const util = require("util");
const functions = require("./function");

const con = mysql.createConnection({
  host: config.databaseHost,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.databaseName,
  multipleStatements: true,
});

const dbConnect = util.promisify(con.connect).bind(con);

async function main() {
  try {
    const result = await dbConnect();
    console.log("Started iteration on - " + new Date());
    console.log("Connection established");
  } catch (error) {
    console.log(" dbconnect.js ~ line 22 ~ main ~ error", error)
    throw functions.errorHandler(error);
  }
}

main();
module.exports = con
