import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (
    event.pathParameters === undefined ||
    event.pathParameters["customerId"] === undefined
  ) {
    throw new Error("A valid customer id must be provided");
  }

  const logger = new WinstonLogger();
  const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);

  try {
    const order = await orders.getForCustomer(
      event.pathParameters["customerId"]
    );

    return new ApiResponse<any>(true, "OK", order).respond();
  } catch (error) {
    logger.logError(
      `Failure retrieving orders for ${event.pathParameters["customerId"]}`,
      error
    );

    return new ApiResponse<Error>(false, "FAILURE", error as Error).respond();
  }
};
