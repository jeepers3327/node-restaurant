import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ApiResponse } from "../../common/api-response";
import { CreateOrderCommandHandler } from "../../domain/usecases/create-new-order";
import { InfrastructureSetup } from "../../infrastructure/domain-event-handlers/add-handlers";
import { WinstonLogger } from "../../infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "../../infrastructure/order-repository-fauna-db";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  InfrastructureSetup.addAzureHandlers();

  const createOrderHandler = new CreateOrderCommandHandler(
    new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY),
    new WinstonLogger()
  );

  const createdOrderNumber = await createOrderHandler.execute({
    customerId: context.bindingData.customerId,
    items: req.body.orderItems,
    address: req.body.deliveryAddress,
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(new ApiResponse<string>(true, 'OK', createdOrderNumber)),
    headers: {
        'Content-Type': 'application/json'
    }
  };
};

export default httpTrigger;
