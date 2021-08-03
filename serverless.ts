import type { AWS } from "@serverless/typescript";

//import dynamoTable from "./resources/dynamodb-table";
import functions from "./resources/functions";

const serverlessConfiguration: AWS = {
  service: "backend",
  frameworkVersion: "2",
  useDotenv: true,
  custom: {
    variablesResolutionMode: 20210326,
    region: "${opt:region, self:provider.region}",
    stage: "${opt:stage, self:provider.stage}",
    dynamodb_table: "epm-ddl",
    table_throughputs: {
      dev: 5,
      default: 5,
    },

    table_throughput:
      "${self:custom.table_throughputs.${self:custom.stage}, self:custom.table_throughputs.default}",
    // dynamodb: {
    //   stages: ["dev"],
    //   start: {
    //     port: 8000,
    //     inMemory: true,
    //     heapInitial: "200m",
    //     heapMax: "1g",
    //     migrate: true,
    //     seed: true,
    //     convertEmptyValues: true,
    //     // Uncomment only if you already have a DynamoDB running locally
    //     // noStart: true
    //   },
    // },
    "serverless-offline": {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
    },
  },
  plugins: [
    "serverless-bundle",
    "serverless-dynamodb-local",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  package: {
    individually: false,
  },
  provider: {
    name: "aws",
    stage: "dev",
    region: "us-east-1",
    runtime: "nodejs14.x",
    iam: {
      role: ""
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      DYNAMODB_TABLE: "${self:custom.dynamodb_table}",
    },
    lambdaHashingVersion: "20201221"
  },
  // import the function via paths
  functions,
  // resources: {
  //   Resources: dynamoTable,
  // },
};

module.exports = serverlessConfiguration;