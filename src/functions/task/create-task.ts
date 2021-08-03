import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import TaskModel from "../../models/task.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/task/create.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const createTask: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      // Initialise database service
      const databaseService = new DatabaseService();

      // Initialise and hydrate model
      const taskModel = new TaskModel(requestData);

      // Get model data
      const data = taskModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `TASK#${data.task_id}`,
          task_id: data.task_id,
          user: data.user,
          name: data.name,
          isCompleted: data.isCompleted,
          description: data.description,
          created_at: data.created_at,
        },
      };
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data.task_id;
    })
    .then((taskId) => {
      // Set Success Response
      response = new ResponseModel(
        { taskId },
        StatusCode.OK,
        ResponseMessage.CREATE_TASK_SUCCESS
      );
    })
    .catch((error) => {
      // Set Error Response
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.CREATE_TASK_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
