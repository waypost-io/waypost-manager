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

  async getRowsWhere(whereObj = {}) {
    const [queryString, params] = qc.createSelectStatement.call(this, whereObj);
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
    const [ queryString, params ] = qc.createUpdateStatement.call(this, updatedFields, where);
    const result = await dbQuery(queryString, ...params);
    return result.rows[0];
  }

  async deleteRow(where = {}) {
    const [queryString, params] = qc.createDeleteStatement.call(this, where);
    const result = await dbQuery(queryString, ...params);
    return result;
  }

  async deleteAllRows() {
    const statement = `DELETE FROM ${this.tableName} WHERE TRUE`;
    const result = await dbQuery(queryString);
    return result;
  }
  // just a wrapper around the dbQuery function
  async query(string, params = []) {
    return await dbQuery(string, ...params);
  }
};
