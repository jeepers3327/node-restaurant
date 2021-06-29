import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ApiResponse } from "../../common/api-response";
import { IOrder } from "../../domain/entities/order";
import { CancelOrderCommandHandler } from "../../domain/usecases/cancel-order";
import { InfrastructureSetup } from "../../infrastructure/domain-event-handlers/add-handlers";
import { WinstonLogger } from "../../infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "../../infrastructure/order-repository-fauna-db";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const logger = new WinstonLogger();
  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  try {
    const order = await orders.getSpecific(
      context.bindingData.customerId,
      context.bindingData.orderNumber
    );
5
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: new ApiResponse<IOrder>(true, "OK", order),
    };
  } catch (error) {
    logger.logError(
      `Failure retrieving orders for ${context.bindingData.customerId}`,
      error
    );

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: new ApiResponse<Error>(false, "FAILURE", error as Error),
      headers: {
          'Content-Type': 'application/json'
      }
    };
  }
};

export default httpTrigger;
