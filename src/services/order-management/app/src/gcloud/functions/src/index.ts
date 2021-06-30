import * as functions from 'firebase-functions';
import express from 'express';
import { WinstonLogger } from "../../../infrastructure/logger-winston";
import { ApiResponse } from "../../../common/api-response";
import { IOrder } from "../../../domain/entities/order";
import { OrderRepositoryFaunaDbImpl } from "../../../infrastructure/order-repository-fauna-db";

const app = express();
const main = express();
const logger = new WinstonLogger();

main.use('/', app);

app.get('/', (req, res) => {
  res.send('Hello Worldy!')
});

app.get('/:customerId/orders/list', async (req, res) => {
  try
  {
    logger.logInformation(req.params.customerId);

    const orders = new OrderRepositoryFaunaDbImpl(
      'fnAEM4Zz3SACDniKufHVWHkTG0TdWm-hzED2ogLz'
    );

    const order = await orders.getForCustomer(req.params.customerId);

    res.send(new ApiResponse<IOrder[]>(true, "OK", order));
  }
  catch (error) {
    logger.logInformation(req.params.customerId);
    res.send(error);
  }
  
  // try {
   

  //   

  //   
  // } catch (error) {
  //   logger.logError(
  //     `Failure retrieving orders for ${req.params.customerId}`,
  //     error
  //   );

  //   res.send(new ApiResponse<Error>(false, "FAILURE", error as Error));
  // }
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(main);