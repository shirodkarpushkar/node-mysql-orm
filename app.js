const config = require("./config");
const db = require("./dbconnect");
const util = require("util");
const query = util.promisify(db.query).bind(db);
const functions = require("./function");
const querySchema = {
  where: {
    id: 18,
  },
  order: {
    id: "DESC",
  },
};
const getSchema = {
  table: "customer_addresses",
  fields: {
    id: {
      type: "pk",
      //   alias: "id",
    },
    customer: {
      type: "fk",
      alias: "document",
    },
    address: {
      type: "column",
      alias: "addressLine1",
    },
    address2: {
      type: "column",
      alias: "addressLine2",
    },
    city: {
      type: "column",
      alias: "city",
    },
    state: {
      type: "column",
      alias: "state",
    },
    zipcode: {
      type: "column",
      alias: "zipcode",
    },
  },
};

async function get(getSchema, queryParams) {
  try {
    const fields = getSchema.fields ? Object.keys(getSchema.fields) : [];
    const fieldAliases = fields.map((el) => {
      if (getSchema.fields[el].alias) {
        return el + " as " + getSchema.fields[el].alias;
      } else {
        return el;
      }
    });
    const fieldCommaSep = fieldAliases.length ? fieldAliases.join(",") : "*";
    var sqlQuery = `SELECT ${fieldCommaSep} FROM ${getSchema.table}`;
    if (queryParams) {
      if (queryParams.where) {
        const whereStr = [];
        for (let key in queryParams.where) {
          whereStr.push(key + " = " + queryParams.where[key]);
        }
        sqlQuery = sqlQuery + " WHERE " + whereStr.join(" AND ");
      }
      if (queryParams.order) {
        const key = Object.keys(queryParams.order)[0];
        const value = queryParams.order[key];
        sqlQuery = sqlQuery + " ORDER BY " + key + " " + value;
      }
    }
    console.log("query ==> ", sqlQuery);
    const result = await query(sqlQuery);
    return result;
  } catch (error) {
    throw functions.errorHandler(error);
  }
}
async function create(schema, values) {
  try {
    const fields = schema.fields
      ? Object.keys(schema.fields).filter((colVal) => colVal !== "id")
      : [];
    const fieldCommaSep = fields.join(",");
    const insertValues = [values.map((el) => Object.values(el))];

    const insertQuery = `INSERT INTO ${schema.table} ( ${fieldCommaSep} ) VALUES ? `;

    const result = await query(insertQuery, insertValues);
    return result;
  } catch (error) {
    throw functions.errorHandler(error);
  }
}
async function update(schema, field, queryParams) {
  try {
    const entries = Object.entries(field);
    const fields = entries.map((el) => `${el[0]} = '${el[1]}' `);
    const fieldCommaSep = fields.join(",");

    var sqlQuery = `UPDATE ${schema.table} SET ${fieldCommaSep} `;

    if (queryParams.where) {
      const whereStr = [];
      for (let key in queryParams.where) {
        whereStr.push(` ${key} = '${queryParams.where[key]}' `);
      }
      sqlQuery = sqlQuery + " WHERE " + whereStr.join(" AND ");
    }

    const result = await query(sqlQuery);
    return result;
  } catch (error) {
    throw functions.errorHandler(error);
  }
}
async function remove(schema, queryParams) {
  try {
    var sqlQuery = `DELETE FROM ${schema.table}`;

    if (queryParams.where) {
      const whereStr = [];
      for (let key in queryParams.where) {
        whereStr.push(` ${key} = '${queryParams.where[key]}' `);
      }
      sqlQuery = sqlQuery + " WHERE " + whereStr.join(" AND ");
    }

    const result = await query(sqlQuery);
    return result;
  } catch (error) {
    throw functions.errorHandler(error);
  }
}
async function getRecursive(getSchema) {
  try {
    const fields = Object.keys(getSchema.fields);
    const fieldAliases = fields.map((el) => {
      if (getSchema.fields[el].alias) {
        return el + " as " + getSchema.fields[el].alias;
      } else {
        return el;
      }
    });
    const fieldCommaSep = fieldAliases.join(",");
    const sqlQuery = `SELECT ${fieldCommaSep} FROM ${getSchema.table}`;
    const result = await query(sqlQuery);
    return result;
  } catch (error) {
    throw functions.errorHandler(error);
  }
}

async function main() {
  try {
    const queryParams = {
      where: {
        id: 38,
      },
    };

    const result = await remove(getSchema, queryParams);
    console.log("line 58 ~ result", JSON.stringify(result, null, 4));
  } catch (error) {
    console.log(" app.js ~ line 63 ~ main ~ err", error);
  }
}

main();
