import { ApiResponse } from "../common/api-response";
import { ApiGatewayEvent } from "../common/apigateway/apigateway-event";
import { ApiGatewayResponse } from "../common/apigateway/apigateway-response";
import { IOrder } from "../domain/entities/order";
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

  try{
    const orders = new OrderRepositoryDynamoDb();

    const order = await orders.getSpecific(event.pathParameters["customerId"], event.pathParameters["orderNumber"])
  
    return new ApiResponse<IOrder>(true, 'OK', order).respond();
  }
  catch (error)
  {
    return new ApiResponse<Error>(false, 'FAILURE', error as Error).respond();
  }
};
