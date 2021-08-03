export enum ResponseMessage {

  CREATE_USER_SUCCESS = "User successfully created",
  CREATE_USER_FAIL = "User cannot be created",
  DELETE_USER_SUCCESS = "User successfully deleted",
  DELETE_USER_FAIL = "User cannot be deleted",
  GET_USER_SUCCESS = "User successfully retrieved",
  GET_USER_FAIL = "User not found",
  UPDATE_USER_SUCCESS = "User successfully updated",
  UPDATE_USER_FAIL = "User cannot be updated",



  CREATE_TASK_SUCCESS = "Task successfully created",
  CREATE_TASK_FAIL = "Task cannot be created",
  DELETE_TASK_SUCCESS = "Task successfully deleted",
  DELETE_TASK_FAIL = "Task cannot be deleted",
  GET_TASK_SUCCESS = "Task successfully retrieved",
  GET_TASK_FAIL = "Task not found",
  UPDATE_TASK_SUCCESS = "Task successfully updated",
  UPDATE_TASK_FAIL = "Task cannot be updated",

  ERROR = "Unknown error.",
  INVALID_REQUEST = "Invalid Request!",
  GET_ITEM_ERROR = "Item does not exist",
}
