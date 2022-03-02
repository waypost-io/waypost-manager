const { dbQuery } = require("./db-query");
// const bcrypt = require("bcrypt");

module.exports = class Pg {
  // This is where we might add user data for logging purposes
  // constructor(session) {
  //   this.username = session.username;
  // }

  async allFlags() {
    const ALL_FLAGS = "SELECT * FROM flags;";
    const resultFlags = await dbQuery(ALL_FLAGS);

    // console.log(resultFlags);
    const allFlags = resultFlags.rows;
    if (!allFlags) {
      throw new Error("Flags could not be retreived from postgres");
    }

    return allFlags;
  }
};

// module.exports = class PgPersistence {
//   constructor(session) {
//     this.username = session.username;
//   }

//   isDoneTodoList(todoList) {
//     return (
//       todoList.todos.length > 0 && todoList.todos.every((todo) => todo.done)
//     );
//   }

//   async sortedTodoLists() {
//     const ALL_TODOLISTS =
//       "SELECT * FROM todolists WHERE username = $1 ORDER BY lower(title) ASC";
//     const ALL_TODOS = "SELECT * FROM todos WHERE username = $1";

//     let resultTodoLists = dbQuery(ALL_TODOLISTS, this.username);
//     let resultTodos = dbQuery(ALL_TODOS, this.username);
//     let resultBoth = await Promise.all([resultTodoLists, resultTodos]);

//     let allTodoLists = resultBoth[0].rows;
//     let allTodos = resultBoth[1].rows;
//     if (!allTodoLists || !allTodos) return undefined;

//     allTodoLists.forEach((todoList) => {
//       todoList.todos = allTodos.filter((todo) => {
//         return todoList.id === todo.todoList_id;
//       });
//     });

//     return this._partitionTodoLists(allTodoLists);
//   }

//   async sortedTodos(todoList) {
//     const SORTED_TODOS =
//       "SELECT * FROM todos WHERE todolist_id = $1 AND username = $2 ORDER BY done ASC, lower(title) ASC";
//     const todoListId = todoList.id;

//     let result = await dbQuery(SORTED_TODOS, todoListId, this.username);
//     return result.rows;
//   }

//   async loadTodoList(todoListId) {
//     const FIND_TODOLIST =
//       "SELECT * FROM todolists WHERE id = $1 AND username = $2";
//     const FIND_TODOS =
//       "SELECT * FROM todos WHERE todolist_id = $1 AND username = $2";

//     let resultTodoList = dbQuery(FIND_TODOLIST, todoListId, this.username);
//     let resultTodos = dbQuery(FIND_TODOS, todoListId, this.username);
//     let resultBoth = await Promise.all([resultTodoList, resultTodos]);

//     let todoList = resultBoth[0].rows[0];
//     if (!todoList) return undefined;

//     todoList.todos = resultBoth[1].rows;
//     return todoList;
//   }

//   hasUndoneTodos(todoList) {
//     return todoList.todos.some((todo) => !todo.done);
//   }

//   async loadTodo(todoListId, todoId) {
//     const FIND_TODO =
//       "SELECT * FROM todos WHERE todolist_id = $1 AND id = $2 AND username = $3";

//     let result = await dbQuery(FIND_TODO, todoListId, todoId, this.username);
//     return result.rows[0];
//   }

//   async toggleDoneTodo(todoListId, todoId) {
//     const TOGGLE_DONE =
//       "UPDATE todos SET done = NOT done WHERE todolist_id = $1 AND id = $2 AND username = $3";

//     let result = await dbQuery(TOGGLE_DONE, todoListId, todoId, this.username);
//     return result.rowCount > 0;
//   }

//   async deleteTodo(todoListId, todoId) {
//     const DELETE_TODO =
//       "DELETE FROM todos WHERE todolist_id = $1 AND id = $2 AND username = $3";

//     let result = await dbQuery(DELETE_TODO, todoListId, todoId, this.username);
//     return result.rowCount > 0;
//   }

//   async deleteTodoList(listId) {
//     const DELETE_LIST = "DELETE FROM todolists WHERE id = $1 AND username = $2";

//     let result = await dbQuery(DELETE_LIST, listId, this.username);
//     return result.rowCount > 0;
//   }

//   async completeAllTodos(todoListId) {
//     const COMPLETE_ALL_TODOS =
//       "UPDATE todos SET done = true WHERE todolist_id = $1 AND username = $2 AND NOT done";

//     let result = await dbQuery(COMPLETE_ALL_TODOS, todoListId, this.username);
//     return result.rowCount > 0;
//   }

//   async createTodo(todoListId, title) {
//     const CREATE_TODO =
//       "INSERT INTO todos (title, todolist_id, username) VALUES ($1, $2, $3)";

//     let result = await dbQuery(CREATE_TODO, title, todoListId, this.username);
//     return result.rowCount > 0;
//   }

//   async existsTodoListTitle(title) {
//     const FIND_TODOLIST =
//       "SELECT null FROM todolists WHERE title = $1 AND username = $2";

//     let result = await dbQuery(FIND_TODOLIST, title, this.username);
//     return result.rowCount > 0;
//   }

//   async setTodoListTitle(todoListId, todoListTitle) {
//     const CHANGE_TITLE =
//       "UPDATE todolists SET title = $1 WHERE id = $2 AND username = $3";

//     let result = await dbQuery(
//       CHANGE_TITLE,
//       todoListTitle,
//       todoListId.this.username
//     );
//     return result.rowCount > 0;
//   }

//   async createTodoList(title) {
//     const CREATE_LIST =
//       "INSERT INTO todolists (title, username) VALUES ($1, $2)";

//     try {
//       let result = await dbQuery(CREATE_LIST, title, this.username);
//       return result.rowCount > 0;
//     } catch (error) {
//       if (this.isUniqueConstraintViolation(error)) return false;
//       throw error;
//     }
//   }

//   async authenticate(username, password) {
//     let FIND_HASHED_PASSWORD = "SELECT password FROM users WHERE username = $1";

//     let result = await dbQuery(FIND_HASHED_PASSWORD, username);
//     if (result.rowCount === 0) return false;

//     return bcrypt.compare(password, result.rows[0].password);
//   }

//   _partitionTodoLists(todoLists) {
//     let undone = [];
//     let done = [];

//     todoLists.forEach((todoList) => {
//       if (this.isDoneTodoList(todoList)) {
//         done.push(todoList);
//       } else {
//         undone.push(todoList);
//       }
//     });

//     return undone.concat(done);
//   }

//   isUniqueConstraintViolation(error) {
//     return /duplicate key value violates unique constraint/.test(String(error));
//   }
// };
