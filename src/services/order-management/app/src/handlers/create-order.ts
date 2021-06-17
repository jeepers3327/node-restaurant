import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { CreateOrderCommandHandler } from "../domain/usecases/create-new-order";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryDynamoDb } from "../infrastructure/order-repository-dynamo-db";

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (
    event.pathParameters === undefined ||
    event.pathParameters["customerId"] === undefined
  ) {
    return new ApiResponse<string>(false, 'A valid customer id must be provided', '').respond();
  }

  const createOrderHandler = new CreateOrderCommandHandler(
    new OrderRepositoryDynamoDb(),
    new WinstonLogger()
  );

  const createdOrderNumber = await createOrderHandler.execute({
    customerId: event.pathParameters["customerId"],
  });

  return new ApiResponse<string>(true, 'OK', createdOrderNumber).respond();
};
