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
import requestConstraints from "../../constraints/user/update.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const updateUser: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // const userEmail = event.pathParameters.userEmail;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure useral variable
  const { DYNAMODB_TABLE } = process.env;

  // Destructure request data
  const { user_id, email, firstName, lastName, role } = requestData;

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Item exists
    databaseService.getItem({
      hash: "pk",
      hashValue: `USER#${email}`,
      tableName: DYNAMODB_TABLE,
    }),
  ])
    .then(async () => {
      // Initialise DynamoDB UPDATE parameters
      const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
          pk: `USER#${email}`,
        },
        UpdateExpression: `set
                #user_id = :user_id,
                #email = :email,
                #firstName = :firstName,
                #lastName = :lastName,
                #role = :role,
                updated_at = :timestamp`,
        ExpressionAttributeNames: {
          "#user_id": "user_id",
          "#email": "email",
          "#firstName": "firstName",
          "#lastName": "lastName",
          "#role": "role",
        },
        ExpressionAttributeValues: {
          ":user_id": user_id,
          ":email": email,
          ":firstName": firstName,
          ":lastName": lastName,
          ":role": role,
          ":timestamp": new Date().getTime(),
        },
        ReturnValues: "UPDATED_NEW",
      };
      // Updates Item in DynamoDB table
      return await databaseService.update(params);
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel(
        { ...results.Attributes },
        StatusCode.OK,
        ResponseMessage.UPDATE_USER_SUCCESS
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
              ResponseMessage.UPDATE_USER_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
