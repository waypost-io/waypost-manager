const { dbQuery } = require("./db-query");
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
    const values = columns.map((col) => `'${newRow[col]}'`);
    return `INSERT INTO ${this.tableName}(${columns.join(
      ", "
    )}) VALUES (${values.join(", ")}) RETURNING *`;
  }

  createUpdateStatement(id, updatedFields) {
    const edits = [];
    Object.keys(updatedFields).forEach((fieldName) => {
      if (this.fields.includes(fieldName)) {
        edits.push(`${fieldName} = '${updatedFields[fieldName]}'`);
      }
    });

    return `UPDATE ${this.tableName} SET ${edits.join(
      ", "
    )} WHERE id = ${id} RETURNING *`;
  }

  createDeleteStatement(id) {
    return `DELETE FROM ${this.tableName} WHERE id = ${id} RETURNING *`;
  }

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

  async insertRow(obj) {
    const queryString = this.createInsertStatement(obj);
    const result = await dbQuery(queryString);
    return result.rows[0];
  }

  async editRow(id, updatedFields) {
    const queryString = this.createUpdateStatement(id, updatedFields);
    console.log("query in editRow", queryString);
    const result = await dbQuery(queryString);
    return result.rows[0];
  }

  async deleteRow(id) {
    const queryString = this.createDeleteStatement(id);
    const result = await dbQuery(queryString);
    return result;
  }
};
