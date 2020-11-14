var AWS = require("aws-sdk");
import { v4 as uuid } from "uuid";

const tableName = process.env.TABLE_NAME || "";

const dynamo = new AWS.DynamoDB.DocumentClient();

function createResponse(body: string, statusCode: number = 200) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

async function isEmailExists(data: { email: string }) {
  const email = data.email;

  const result = await dynamo
    .query({
      TableName: tableName,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
    .promise();

  // const result = await dynamo
  //   .scan({
  //     TableName: tableName,
  //     FilterExpression: "email = :email",
  //     ExpressionAttributeValues: { ":email": email },
  //   })
  //   .promise();

  return result.Count > 0;
}

async function addEmail(data: { email: string }) {
  const email = data.email;

  await dynamo
    .put({
      TableName: tableName,
      Item: { id: uuid(), email },
    })
    .promise();

  return email;
}

exports.handler = async function (event: any) {
  try {
    const { httpMethod, body } = event;

    if (httpMethod === "OPTIONS") return createResponse("ok");

    if (!body) return createResponse("Missing request body", 500);

    const requestBody = JSON.parse(body);

    if (httpMethod === "POST") {
      const isEmailDefined = requestBody.email && requestBody.email !== "";

      if (!isEmailDefined) return createResponse("Email is missing", 500);

      const isExists = await isEmailExists(requestBody);

      if (isExists)
        return createResponse(
          `Email ${requestBody.email} already exists in the database`,
          409
        );

      await addEmail(requestBody);

      return createResponse(`${requestBody.email} added to list`);
    }

    return createResponse(
      `We only accept POST, OPTIONS, not ${httpMethod}`,
      500
    );
  } catch (error) {
    console.log(error);
    return createResponse(error, 500);
  }
};
