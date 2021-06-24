import { DynamoDB } from "aws-sdk";
import { PutItemInput, Converter } from "aws-sdk/clients/dynamodb";
import { Orders } from "../domain/entities/order-repository";
import { IOrder, OrderFactory } from "../domain/entities/order";

export class OrderRepositoryDynamoDb implements Orders {
  docClient: DynamoDB.DocumentClient;
  table = "";
  dynamodb = new DynamoDB();

  constructor() {
    this.docClient = new DynamoDB.DocumentClient();

    if (process.env.TABLE_NAME != undefined) {
      this.table = process.env.TABLE_NAME;
    }
  }
  delete(orderNumber: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async addNew(order: IOrder): Promise<void> {
    const params: PutItemInput = {
      TableName: this.table,
      Item: this.asAttributeMap(order),
    };

    console.log(
      `Storing record ${order.orderNumber} in the ${this.table} Table.`
    );
    console.log(`${JSON.stringify(params.Item)}`);

    await this.dynamodb.putItem(params).promise();
    return;
  }

  async getSpecific(customerId: string, orderNumber: string): Promise<IOrder> {
    console.log(
      `Fetching record ${orderNumber} for customer ${customerId} from the ${this.table} Table.`
    );

    const resp = await this.dynamodb
      .getItem({
        TableName: this.table,
        Key: {
          ...this.keys(customerId, orderNumber),
        },
      })
      .promise();

    console.log(resp.Item);

    if (resp.Item == undefined) {
      throw new Error(`Order ${orderNumber} not found`);
    } else {
      return this.orderFromItem(Converter.unmarshall(resp.Item['Data'].M));
    }
  }

  async update(order: IOrder): Promise<void> {
    const params: PutItemInput = {
      TableName: this.table,
      Item: this.asAttributeMap(order),
    };

    console.log(
      `Storing record ${order.orderNumber} in the ${this.table} Table.`
    );
    console.log(`${JSON.stringify(params.Item)}`);

    await this.dynamodb.putItem(params).promise();
    return;
  }

  keys(customerId: string, orderNumber: string) {
    return {
      PK: { S: `CUSTOMER#${customerId.toUpperCase()}` },
      SK: { S: `ORDER#${orderNumber.toUpperCase()}` },
    };
  }

  asAttributeMap(order: IOrder) {
    return {
      ...this.keys(order.customerId, order.orderNumber),
      Type: { S: "Order" },
      Data: { M: Converter.marshall(order) },
    };
  }

  orderFromItem(attributes: any) {
    return OrderFactory.CreateFromObject(attributes);
  }
}
