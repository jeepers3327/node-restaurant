import { DomainEvents } from "node-js-ddd/dist/events/domain-event-handling";
import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { CreateOrderCommandHandler } from "../domain/usecases/create-new-order";
import { WinstonLogger } from "../infrastructure/logger-winston";
import { OrderRepositoryDynamoDb } from "../infrastructure/order-repository-dynamo-db";
import { OrderCreatedEventPublisher } from '../infrastructure/domain-event-handlers/order-created-event-publisher';
import { OrderRepositoryFaunaDbImpl } from '../infrastructure/order-repository-fauna-db';

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (
    event.pathParameters === undefined ||
    event.pathParameters["customerId"] === undefined
  ) {
    return new ApiResponse<string>(false, 'A valid customer id must be provided', '').respond();
  }

  DomainEvents.registerHandler(new OrderCreatedEventPublisher());

  const createOrderHandler = new CreateOrderCommandHandler(
    new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY),
    new WinstonLogger()
  );

  const requestBody = JSON.parse(event.body);

  const createdOrderNumber = await createOrderHandler.execute({
    customerId: event.pathParameters["customerId"],
    items: requestBody.orderItems,
    address: requestBody.deliveryAddress
  });

  return new ApiResponse<string>(true, 'OK', createdOrderNumber).respond();
};
