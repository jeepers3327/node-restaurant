import { ApiResponse } from "./common/api-response";
import { WinstonLogger } from "./infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "./infrastructure/order-repository-fauna-db";

import express from 'express';

import cors from 'cors';

const app = express();
const port = 80; // default port to listen

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// define a route handler for the default home page
app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/:customerId/orders/list", async (req, res) => {
  const logger = new WinstonLogger();
  const orders = new OrderRepositoryFaunaDbImpl(
    process.env.FAUNA_DB_ACCESS_KEY
  );

  try {
    const order = await orders.getForCustomer(
      req.params.customerId
    );

    res.send(new ApiResponse<any>(true, "OK", order));
  } catch (error) {
    logger.logError(
      `Failure retrieving orders for ${req.params.customerId}`,
      error
    );

    res.send(new ApiResponse<Error>(false, "FAILURE", error as Error));
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
