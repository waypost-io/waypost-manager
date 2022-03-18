const { dbQuery } = require("./db-query");
const { createPlaceholdersArr } = require("../utils");
// const bcrypt = require("bcrypt");

module.exports = class PGTable {
  // This is where we might add user data for logging purposes
  // constructor(session) {
  //   this.username = session.username;
  // }
  constructor(tableName) {
    this.tableName = tableName;
    this.fields = [];
  }

  async init() {
    this.fields = await this.getFields();
    return this;
  }

  createInsertStatement(newRow) {
    const columns = this.fields.filter(
      (col) => ![null, "", undefined].includes(newRow[col])
    );
    const values = columns.map((col) => `${newRow[col]}`);
    const placeholders = createPlaceholdersArr(values);
    const queryString = `INSERT INTO ${this.tableName}(${columns.join(", ")})
      VALUES (${placeholders.join(", ")}) RETURNING *`;
    return [queryString, values]
  }
  // pass in object with the criteria that you want to add to where statement
  // Ex. { id: 2, date_ended: "NOT NULL"} =>
  //  ["WHERE id = $1 AND date_ended IS NOT NULL", ['2']]
  // nextPlaceholderNum is a number that'll start the sequence of placeholders
  createWhereStatement(obj, nextPlaceholderNum = 1) {
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
    const [where, wValues] = this.createWhereStatement(whereObj, validUpdatedValues.length + 1);
    const values = validUpdatedValues.concat(wValues);
    const queryString = `UPDATE ${this.tableName} SET ${edits.join(
      ", "
    )} ${where} RETURNING *`;
    return [queryString, values];
  }

  createDeleteStatement(whereObj = {}) {
    const [where, wValues] = this.createWhereStatement(whereObj);
    const queryString = `DELETE FROM ${this.tableName} ${where} RETURNING *`;
    return [queryString, wValues]
  }

  createSelectStatement(whereObj = {}) {
    const [where, wValues] = this.createWhereStatement(whereObj);
    const queryString = `SELECT * FROM ${this.tableName} ${where}`;
    return [queryString, wValues]
  }
  // gets the column names
  async getFields() {
    const statement = `SELECT * FROM ${this.tableName} WHERE false`;
    const result = await dbQuery(statement);
    return result.fields.map((fieldObj) => fieldObj.name);
  }

  async getAllRows() {
    const statement = `SELECT * FROM ${this.tableName}`;
    const result = await dbQuery(statement);
    return result.rows;
  }

  async getAllRowsNotDeleted() {
    const statement = `SELECT * FROM ${this.tableName} WHERE is_deleted = FALSE`;
    const result = await dbQuery(statement);
    return result.rows;
  }

  async getRow(id) {
    const statement = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
    const result = await dbQuery(statement);
    return result.rows[0];
  }

  async getRowsWhere(whereObj) {
    const [queryString, params] = this.createSelectStatement(whereObj);
    const result = await dbQuery(queryString, ...params);
    return result.rows;
  }

  async insertRow(obj) {
    const [queryString, params] = this.createInsertStatement(obj);
    const result = await dbQuery(queryString, ...params);
    return result.rows[0];
  }
  // Ex. editRow({ status: false, name: "New Flag"}, { id: 2})
  // => runs the query: UPDATE tableName SET ('status', 'name') WHERE id = 2
  async editRow(updatedFields, where = {}) {
    const [ queryString, params ] = this.createUpdateStatement(updatedFields, where);
    const result = await dbQuery(queryString, ...params);
    return result.rows[0];
  }

  async deleteRow(where = {}) {
    const [queryString, params] = this.createDeleteStatement(where);
    const result = await dbQuery(queryString, ...params);
    return result;
  }

  async deleteAllRows() {
    const queryString = `DELETE FROM ${this.tableName} WHERE TRUE`;
    const result = await dbQuery(queryString);
    return result;
  }
  // just a wrapper around the dbQuery function
  async query(string, params = []) {
    return await dbQuery(string, ...params);
  }
};
