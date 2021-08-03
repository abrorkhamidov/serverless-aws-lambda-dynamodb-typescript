import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import UserModel from "../../models/user.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/user/create.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const createUser: APIGatewayProxyHandler = async (
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

      // Initialise and userModel model
      const userModel = new UserModel(requestData);

      // Get model data
      const data = userModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          pk: `USER#${data.email}`,
          user_id: data.user_id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          created_at: data.created_at,
        },
      };
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data.email;
    })
    .then((userEmail) => {
      // Set Success Response
      response = new ResponseModel(
        { userEmail },
        StatusCode.OK,
        ResponseMessage.CREATE_USER_SUCCESS
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
              ResponseMessage.CREATE_USER_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
