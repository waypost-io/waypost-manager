const { dbQuery } = require("./db-query");
const { queryCreator: qc } = require("../lib/queryCreator");

module.exports = class PGTable {
  constructor(tableName) {
    this.tableName = tableName;
    this.fields = [];
  }

  async init() {
    this.fields = await this.getFields();
    return this;
  }

  // gets the column names
  async getFields() {
    const querystring = `SELECT * FROM ${this.tableName} WHERE false`;
    const result = await dbQuery(querystring);
    return result.fields.map((fieldObj) => fieldObj.name);
  }

  async getAllRows() {
    const querystring = `SELECT * FROM ${this.tableName}`;
    const result = await dbQuery(querystring);
    return result.rows;
  }

  async getAllRowsNotDeleted() {
    const querystring = `SELECT * FROM ${this.tableName} WHERE is_deleted = FALSE`;
    const result = await dbQuery(querystring);
    return result.rows;
  }

  async getRow(id) {
    const querystring = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
    const result = await dbQuery(querystring);
    return result.rows[0];
  }

  async getRowsWhere(where = {}) {
    const [queryString, params] = qc.createSelectStatement.call(this, where);
    const result = await dbQuery(queryString, ...params);
    return result.rows;
  }

  async insertRow(obj) {
    const [queryString, params] = qc.createInsertStatement.call(this, obj);
    const result = await dbQuery(queryString, ...params);
    return result.rows[0];
  }
  // Ex. editRow({ status: false, name: "New Flag"}, { id: 2})
  // => runs the query: UPDATE tableName SET ('status', 'name') WHERE id = 2
  async editRow(updatedFields, where = {}) {
    const [queryString, params] = qc.createUpdateStatement.call(
      this,
      updatedFields,
      where
    );
    const result = await dbQuery(queryString, ...params);
    return result.rows[0];
  }

  async deleteRow(where = {}) {
    const [queryString, params] = qc.createDeleteStatement.call(this, where);
    const result = await dbQuery(queryString, ...params);
    return result;
  }

  async deleteAllRows() {
    const querystring = `DELETE FROM ${this.tableName} WHERE TRUE`;
    const result = await dbQuery(querystring);
    return result;
  }
  // just a wrapper around the dbQuery function
  async query(string, params = []) {
    return await dbQuery(string, ...params);
  }
};
