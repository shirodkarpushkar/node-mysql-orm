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
  table: "fm05__cfattached_documents",
  fields: {
    id: {
      type: "pk",
      //   alias: "id",
    },
    cfdocument_id: {
      type: "fk",
      alias: "document",
      ref: {
        table: "fm05__cfdocuments",
        fields: {
          id: {
            type: "pk",
            alias: "id",
          },
          filename: {
            type: "coloumn",
            alias: "filename",
          },
          destination: {
            type: "coloumn",
            alias: "filename",
          },
          mimetype: {
            type: "coloumn",
            alias: "mimetype",
          },
          size: {
            type: "coloumn",
            alias: "mimetype",
          },
        },
      },
    },
  },
};
const queryParams = {
  where: {
    id: 1,
  },
};
async function get(getSchema, queryParams) {
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
    // console.log("query ==> ", sqlQuery);
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
    const result = await get(getSchema);
    console.log("line 58 ~ result", JSON.stringify(result, null, 4));
  } catch (error) {
    console.log(" app.js ~ line 63 ~ main ~ err", error);
  }
}

main();
