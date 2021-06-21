import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { IOrder } from "../domain/entities/order";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryDynamoDb } from "../infrastructure/order-repository-dynamo-db";

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (
    event.pathParameters === undefined ||
    event.pathParameters["customerId"] === undefined ||
    event.pathParameters["orderNumber"] === undefined
  ) {
    throw new Error("A valid customer id and order number must be provided");
  }

  const logger = new WinstonLogger();
  const orders = new OrderRepositoryDynamoDb();

  try {
    const order = await orders.getSpecific(
      event.pathParameters["customerId"],
      event.pathParameters["orderNumber"]
    );

    return new ApiResponse<IOrder>(true, "OK", order).respond();
  } catch (error) {
    logger.logError(
      `Failure retrieving order ${event.pathParameters["customerId"]} for ${event.pathParameters["orderNumber"]}`,
      error
    );

    return new ApiResponse<Error>(false, "FAILURE", error as Error).respond();
  }
};
