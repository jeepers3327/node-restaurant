import { ApiResponse } from "./common/api-response";
import { WinstonLogger } from "./infrastructure/logger-winston";
import { OrderRepositoryFaunaDbImpl } from "./infrastructure/order-repository-fauna-db";

import express from "express";

import cors from "cors";
import { InfrastructureSetup } from "./infrastructure/domain-event-handlers/add-handlers";
import {
  CancelOrderCommand,
  CancelOrderCommandHandler,
} from "./domain/usecases/cancel-order";
import {
  CreateNewOrderCommand,
  CreateOrderCommandHandler,
} from "./domain/usecases/create-new-order";
import { CommandHandler } from "./infrastructure/command-handler";
import { OrderFactory } from "./domain/entities/order";

const app = express();
const port = 80; // default port to listen

const logger = new WinstonLogger();
const orders = new OrderRepositoryFaunaDbImpl(process.env.FAUNA_DB_ACCESS_KEY);
const commandHandler = new CommandHandler();

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// define a route handler for the default home page
app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/:customerId/:orderNumber", async (req, res) => {
  try {
    const order = await orders.getSpecific(
      req.params.customerId,
      req.params.orderNumber
    );

    res.send(new ApiResponse<any>(true, "OK", order.asJson()));
  } catch (error) {
    logger.logError(
      `Failure retrieving order ${req.params.customerId} for ${req.params.orderNumber}`,
      error
    );

    res.send(new ApiResponse<Error>(false, "FAILURE", error as Error));
  }
});

app.get("/:customerId/orders/list", async (req, res) => {
  try {
    const order = await orders.getForCustomer(req.params.customerId);

    res.send(new ApiResponse<any>(true, "OK", order));
  } catch (error) {
    logger.logError(
      `Failure retrieving orders for ${req.params.customerId}`,
      error
    );

    res.send(new ApiResponse<Error>(false, "FAILURE", error as Error));
  }
});

app.post("/:customerId/:orderNumber/cancel", async (req, res) => {
  if (
    req.params.customerId === undefined ||
    req.params.orderNumber === undefined
  ) {
    return new ApiResponse<string>(
      false,
      "A valid customer id and order number must be provided",
      ""
    ).respond();
  }

  InfrastructureSetup.addHandlers();

  const command = new CancelOrderCommand();
  command.customerId = req.params.customerId;
  command.orderNumber = req.params.orderNumber;

  commandHandler
    .handle(command)
    .then(() => {
      res.send(
        new ApiResponse<string>(true, "OK", "Cancellation request received")
      );
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/:customerId", async (req, res) => {
  if (req.params.customerId === undefined) {
    return new ApiResponse<string>(
      false,
      "A valid customer id must be provided",
      ""
    ).respond();
  }

  InfrastructureSetup.addHandlers();

  const command = new CreateNewOrderCommand();
  command.customerId = req.params.customerId;
  command.items = req.body.orderItems;
  command.address = req.body.deliveryAddress;
  command.orderNumber = OrderFactory.generateNewOrderNumber();

  commandHandler
    .handle(command)
    .then(() => {
      res.send(new ApiResponse<string>(true, "OK", command.orderNumber));
    })
    .catch((err) => {
      res.send(err);
    });
});

// start the Express server
app.listen(port, () => {
  logger.logInformation(`server started at http://localhost:${port}`);
});
