import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/task/id.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const getTask: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const { taskId } = event.pathParameters;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure process.env
  const { DYNAMODB_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints({ taskId }, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      // if it exists
      const params = {
        hash: "pk",
        hashValue: `TASK#${taskId}`,
        tableName: DYNAMODB_TABLE,
      };
      return databaseService.getItem(params);
    })
    .then((data) => {
      // Set Success Response
      response = new ResponseModel(
        { ...data.Item },
        StatusCode.OK,
        ResponseMessage.GET_TASK_SUCCESS
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
              ResponseMessage.GET_TASK_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
