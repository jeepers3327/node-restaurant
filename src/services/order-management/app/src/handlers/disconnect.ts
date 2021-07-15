import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const handler = async (evt) => {
  console.log("Disconnect event data:");
  console.log(evt);

  const client = new DocumentClient();

  const deleteParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      connectionId: evt.requestContext.connectionId,
      globalIdentifier: evt.requestContext.identity.sourceIp,
    },
  };

  try {
    await client.delete(deleteParams).promise();
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to disconnect: " + JSON.stringify(err),
    };
  }

  return { statusCode: 200, body: "Disconnected." };
};
