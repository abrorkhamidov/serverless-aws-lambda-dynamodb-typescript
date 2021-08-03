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

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const getTasks: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const taskName =
    event.queryStringParameters.taskName
      ? event.queryStringParameters.taskName
      : "";
  const limit = event.queryStringParameters.limit ? parseInt(event.queryStringParameters.limit) : 10
  const page = event.queryStringParameters.page ? parseInt(event.queryStringParameters.page):1
  
  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure process.env
  const { DYNAMODB_TABLE } = process.env;
  // Get items from the DynamoDB table
  // if it exists
  const params = {
    TableName: DYNAMODB_TABLE,
    FilterExpression: "contains(#name, :taskName)",
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":taskName": taskName,
    },
  };
  const allData = await databaseService.scan(params);
  return databaseService
    .getScannedData(params,page,limit)
    .then((data) => {
      // Set Success Response
      response = new ResponseModel(
        { items:data, count: allData.Items.length},
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
