import faunadb, {
  Collection,
  Create,
  Delete,
  Now,
  Ref,
  Update,
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

  getForCustomer(customerId: string): Promise<IOrder[]> {
    return new Promise((result, error) => {
      const queryResult = this._client.paginate(
        faunadb.query.Match(
          faunadb.query.Index("customer_order_list"),
          customerId
        )
      );

      let orderData: IOrder[] = [];
      let orderQueryResult = [];

      let order = queryResult
        .map(function (ref) {
          return faunadb.query.Get(ref);
        })
        .each(function (page) {
          if (page.length > 0) {
            page.forEach((pageItem) => {
              orderQueryResult.push({
                ...pageItem.data,
                ...pageItem.ref,
              });
            });
          }
        })
        .then(() => {
          orderQueryResult.forEach((orderRecord) => {
            orderData.push(
              OrderFactory.CreateFromObject({
                _customerId: orderRecord.customerId,
                _orderState: orderRecord.status,
                _orderDate: orderRecord.orderDate,
                _orderNumber: orderRecord.orderNumber,
                _id: orderRecord.value.id,
                _details: {
                  _orderItems: orderRecord.details.orderItems,
                  _dispatchDate: orderRecord.details.dispatchDate,
                  _delivery: {
                    _address: orderRecord.details.delivery.address,
                  },
                },
              })
            );
          });

          return orderQueryResult;
        });

      return result(order);
    });
  }

  async delete(orderNumber: string): Promise<void> {
    let existingORder = await this.getSpecific("", orderNumber);

    return new Promise(async (resolve, error) => {
      const query = Delete(Ref(Collection("orders"), existingORder.id));

      this._client.query(query).then((deleteResult) => {});

      return resolve();
    });
  }

  addNew(order: IOrder): Promise<void> {
    order.details.orderAmount;
    return new Promise((resolve, error) => {
      try {
        const data = this.generateOrderData(order);

        const query = Create(Collection("orders"), data);

        this._client.query(query);

        return resolve();
      } catch (err) {
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

      queryResult
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
          let order = OrderFactory.CreateFromObject({
            _customerId: orderData.customerId,
            _orderState: orderData.status,
            _orderDate: orderData.orderDate,
            _orderNumber: orderData.orderNumber,
            _id: orderData.value.id,
            _details: {
              _orderItems: orderData.details.orderItems,
              _dispatchDate: orderData.details.dispatchDate,
              _delivery: {
                _address: orderData.details.delivery.address,
              },
            },
          });

          return result(order);
        });
    });
  }

  async update(order: IOrder): Promise<void> {
    return new Promise((resolve, error) => {
      try {
        const data = this.generateOrderData(order);

        const query = Update(Ref(Collection("orders"), order.id), data);

        this._client
          .query(query);

        return resolve();
      } catch (err) {
        console.error(err);
        return error(err);
      }
    });
  }

  generateOrderData(order: IOrder) {
    return {
      data: {
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        customerId: order.customerId,
        status: order.status,
        created: Now(),
        details: {
          delivery: {
            deliveryCharge: order.details.delivery.deliveryCharge,
            description: order.details.delivery.description,
            address: {
              addressLine1: order.details.delivery.address.addressLine1,
              addressLine2: order.details.delivery.address.addressLine2,
              addressLine3: order.details.delivery.address.addressLine3,
              addressLine4: order.details.delivery.address.addressLine4,
              addressLine5: order.details.delivery.address.addressLine5,
              postcode: order.details.delivery.address.postcode,
            },
          },
          dispatchDate: order.details.dispatchDate,
          orderAmount: order.details.orderAmount,
          orderItems: order.details.orderItems,
        },
      },
    };
  }
}
