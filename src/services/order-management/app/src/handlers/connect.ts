import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const handler = async (evt) => {
  console.log("Connect event data:");
  console.log(evt);

  const client = new DocumentClient();

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      globalIdentifier: evt.requestContext.identity.sourceIp,
      connectionId: evt.requestContext.connectionId,
    },
  };

  try {
    await client.put(putParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Connected." };
};
