import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { CancelOrderCommandHandler } from "../domain/usecases/cancel-order";
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
    return new ApiResponse<string>(false, 'A valid customer id and order number must be provided', '').respond();
  }

  const createOrderHandler = new CancelOrderCommandHandler(
    new OrderRepositoryDynamoDb(),
    new WinstonLogger()
  );

  await createOrderHandler.execute({
    customerId: event.pathParameters["customerId"],
    orderNumber: event.pathParameters["orderNumber"],
  });

  return new ApiResponse<string>(true, 'OK', 'Cancelled').respond();
};
