import faunadb, {
  Collection,
  Create,
  Documents,
  Get,
  Index,
  Lambda,
  Let,
  Map,
  Match,
  Now,
  Paginate,
  Ref,
  Select,
  Var,
} from "faunadb";
import { IOrder } from "../domain/entities/order";
import { Orders } from "../domain/entities/order-repository";

export class OrderRepositoryFaunaDbImpl implements Orders {
  private _client;

  constructor(accessKey) {
    this._client = new faunadb.Client({
      secret: process.env.FAUNA_DB_SECRET || accessKey,
    });
  }

  addNew(order: IOrder): Promise<void> {
    const data = {
      data: {
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        customerId: order.customerId,
        status: order.status,
        created: Now(),
      },
    };

    const query = Create(Collection("orders"), data);

    this._client.query(query);

    return new Promise((resolve, error) => {
      return resolve();
    });
  }
  getSpecific(customerId: string, orderNumber: string): Promise<IOrder> {
    const result = this._client.paginate(
      faunadb.query.Match(faunadb.query.Index("order_number"), orderNumber)
    );

    result
      .map(function (ref) {
        return faunadb.query.Get(ref);
      })
      .each(function (page) {
        if (page.length === 1) {
            console.log(page[0].data.orderNumber);
            console.log(page[0].data.orderDate);
            console.log(page[0].data.status);
            console.log(page[0].data.customerId);
        }
      });

    return new Promise((result, error) => {
      return result(null);
    });
  }
  update(order: IOrder): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
