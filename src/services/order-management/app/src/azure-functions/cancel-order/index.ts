import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ApiResponse } from "../../common/api-response";
import { CancelOrderCommandHandler } from "../../domain/usecases/cancel-order";
import { CreateOrderCommandHandler } from "../../domain/usecases/create-new-order";
import { InfrastructureSetup } from "../../infrastructure/domain-event-handlers/add-handlers";
import { WinstonLogger } from "../../infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "../../infrastructure/order-repository-fauna-db";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  InfrastructureSetup.addAzureHandlers();

  const createOrderHandler = new CancelOrderCommandHandler(
    new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY),
    new WinstonLogger()
  );

  await createOrderHandler.execute({
    customerId: context.bindingData.customerId,
    orderNumber: context.bindingData.orderNumber,
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: new ApiResponse<string>(true, 'OK', 'Cancelled'),
    headers: {
        'Content-Type': 'application/json'
    }
  };
};

export default httpTrigger;
