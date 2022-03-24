const { createPlaceholdersArr } = require("../utils");

// pass in object with the criteria that you want to add to where statement
// Ex. { id: 2, date_ended: "NOT NULL"} =>
//  ["WHERE id = $1 AND date_ended IS NOT NULL", ['2']]
// nextPlaceholderNum is a number that'll start the sequence of placeholders
function createWhereStatement(obj, nextPlaceholderNum = 1) {
  if (Object.values(obj).length === 0) return "";

  const edits = [];
  const whereVals = [];
  Object.keys(obj).forEach((fieldName, idx) => {
    if (this.fields.includes(fieldName)) {
      if (obj[fieldName] === "NULL" || obj[fieldName] === "NOT NULL") {
        edits.push(`${fieldName} IS ${obj[fieldName]}`)
      } else {
        edits.push(`${fieldName} = $${idx + nextPlaceholderNum}`);
        whereVals.push(obj[fieldName]);
      }
    }
  });
  const queryString = `WHERE ${edits.join(" AND ")} `;
  return [queryString, whereVals];
}

const queryCreator = {
  createInsertStatement(newRow) {
    const columns = this.fields.filter(
      (col) => ![null, "", undefined].includes(newRow[col])
    );
    const values = columns.map((col) => `${newRow[col]}`);
    const placeholders = createPlaceholdersArr(values);
    const queryString = `INSERT INTO ${this.tableName}(${columns.join(", ")})
      VALUES (${placeholders.join(", ")}) RETURNING *`;
    return [queryString, values]
  },

  // Ex. createUpdateStatement({ status: false, name: "New Flag"}, { id: 2})
  // => UPDATE tableName SET ('status', 'name') WHERE id = 2
  createUpdateStatement(updatedFields, whereObj = {}) {
    const edits = [];
    let placeholder = 1;
    const validUpdatedValues = [];
    Object.keys(updatedFields).forEach((fieldName) => {
      if (this.fields.includes(fieldName)) {
        edits.push(`${fieldName} = $${placeholder}`);
        placeholder += 1;
        validUpdatedValues.push(updatedFields[fieldName]);
      }
    });
    const [where, wValues] = createWhereStatement.call(this, whereObj, validUpdatedValues.length + 1);
    const values = validUpdatedValues.concat(wValues);
    const queryString = `UPDATE ${this.tableName} SET ${edits.join(
      ", "
    )} ${where} RETURNING *`;
    console.log("queryString", queryString);
    return [queryString, values];
  },

  createDeleteStatement(whereObj = {}) {
    const [where, wValues] = createWhereStatement.call(this, whereObj);
    const queryString = `DELETE FROM ${this.tableName} ${where} RETURNING *`;
    return [queryString, wValues]
  },

  createSelectStatement(whereObj = {}) {
    const [where, wValues] = createWhereStatement.call(this, whereObj);
    const queryString = `SELECT * FROM ${this.tableName} ${where}`;
    return [queryString, wValues]
  },
}

exports.queryCreator = queryCreator;
