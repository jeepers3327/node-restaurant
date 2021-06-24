import faunadb, {
  Collection,
  Create,
  Delete,
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
  Update,
  Var,
} from "faunadb";
import { IOrder, OrderFactory } from "../domain/entities/order";
import { Orders } from "../domain/entities/order-repository";

export class OrderRepositoryFaunaDbImpl implements Orders {
  private _client;

  constructor(accessKey) {
    this._client = new faunadb.Client({
      secret: process.env.FAUNA_DB_SECRET || accessKey,
    });
  }

  async delete(orderNumber: string): Promise<void> {
    let existingORder = await this.getSpecific("", orderNumber);

    return new Promise(async (resolve, error) => {
      const query = Delete(Ref(Collection("orders"), existingORder.id));

      this._client.query(query).then((deleteResult) => {
        console.log("Delete result");
        deleteResult;
      });

      return resolve();
    });
  }

  addNew(order: IOrder): Promise<void> {
    return new Promise((resolve, error) => {
      try {
        const data = {
          data: {
            orderNumber: order.orderNumber,
            orderDate: order.orderDate,
            customerId: order.customerId,
            status: order.status,
            created: Now()
          },
        };
    
        const query = Create(Collection("orders"), data);
    
        this._client.query(query);

        return resolve();
      }
      catch (err) {
        console.error(err);
        return error(err);
      }
    });
  }
  getSpecific(customerId: string, orderNumber: string): Promise<IOrder> {
    return new Promise((result, error) => {
      const queryResult = this._client.paginate(
        faunadb.query.Match(faunadb.query.Index("order_search"), orderNumber)
      );

      let orderData;

      let order = queryResult
        .map(function (ref) {
          return faunadb.query.Get(ref);
        })
        .each(function (page) {
          if (page.length === 1) {
            orderData = {
              ...page[0].data,
              ...page[0].ref,
            };
          }
        })
        .then((res) => {
          console.log(orderData.value);

          let order = OrderFactory.CreateFromObject({
            _customerId: orderData.customerId,
            _orderState: orderData.status,
            _orderDate: orderData.orderDate,
            _orderNumber: orderData.orderNumber,
            _id: orderData.value.id,
          });

          return order;
        });

      return result(order);
    });
  }

  async update(order: IOrder): Promise<void> {
    let existingOrder = await this.getSpecific(
      order.customerId,
      order.orderNumber
    );

    return new Promise((resolve, error) => {
      const data = {
        data: {
          orderNumber: order.orderNumber,
          orderDate: order.orderDate,
          customerId: order.customerId,
          status: order.status,
          created: Now(),
        },
      };

      const query = Update(Ref(Collection("orders"), existingOrder.id), data);

      this._client
        .query(query)
        .then((ret) => {})
        .catch((err) => console.error(err));

      return resolve();
    });
  }
}
