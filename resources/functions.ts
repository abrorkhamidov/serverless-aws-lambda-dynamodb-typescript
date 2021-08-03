export default {
  createUser: {
    handler: "handler.createUser",
    events: [
      {
        http: {
          method: "POST",
          path: "users",
           cors: true
        },
      },
    ],
  },
  getUser: {
    handler: "handler.getUser",
    events: [
      {
        http: {
          method: "GET",
          path: "users/{userEmail}",
           cors: true
        },
      },
    ],
  },
  getUsers: {
    handler: "handler.getUsers",
    events: [
      {
        http: {
          method: "GET",
          path: "users",
          cors: true
        },
      },
    ],
  },
  updateUser: {
    handler: "handler.updateUser",
    events: [
      {
        http: {
          method: "PUT",
          path: "users/{userEmail}",
          cors: true
        },
      },
    ],
  },
  deleteUser: {
    handler: "handler.deleteUser",
    events: [
      {
        http: {
          method: "DELETE",
          path: "users/{userEmail}",
          cors: true
        },
      },
    ],
  },
  createTask: {
    handler: "handler.createTask",
    events: [
      {
        http: {
          method: "POST",
          path: "tasks",
           cors: true
        },
      },
    ],
  },
  getTask: {
    handler: "handler.getTask",
    events: [
      {
        http: {
          method: "GET",
          path: "tasks/{taskId}",
           cors: true
        },
      },
    ],
  },
  getTasks: {
    handler: "handler.getTasks",
    events: [
      {
        http: {
          method: "GET",
          path: "tasks",
           cors: true
        },
      },
    ],
  },
  updateTask: {
    handler: "handler.updateTask",
    events: [
      {
        http: {
          method: "PUT",
          path: "tasks/{taskId}",
           cors: true
        },
      },
    ],
  },
  deleteTask: {
    handler: "handler.deleteTask",
    events: [
      {
        http: {
          method: "DELETE",
          path: "tasks/{taskId}",
           cors: true
        },
      },
    ],
  }
};
