# Messages

## Messages

| Name | Description | Synchronous (S) or Asynchronous (A) |
|---|---|---|
| order.neworder | Create a new order for a customer | S | 
| order.cancelorder | Cancel an order | S | 
| order.orderdispatched | An order has been dispatched | A | 
| customer.newcustomer | A new customer has been created | S | 
| customer.update | Update a customer record | S | 
| order.prep | Start the preparation of an order | S | 
| order.prepcomplete | The preparation of an order has completed | S | 
| order.bakecomplete | The order has finished baking | S |
| menu.addnewitem | Add a new order to the menu | S | 
| menu.checkstock | Check the stock of an item on the menu | S | 
| payment.collectpayment | Collect the payment for an order | S | 
| payment.paymentcompleted | The payment has completed | A | 

## Message Flow

| Name | Message Flow |
|---|---|
| New Order Added | 1. order.neworder 2. menu.checkstock 3. payment.collectpayment 4. payment.paymentcompleted 5. order.prep |
| Order cancelled | 1. order.cancelorder |
| Order cooking | 1. order.prepcomplete 2. order.bakecomplete 3. order.orderdispatched |
| Customer added | 1. customer.newcustomer |
| Customer updated | 1. customer.update |
| Add new menu item | 1. menu.addnewitem |

## Contexts

| Name | Description | Sends | Receives |
|---|---|---|---|
| front | Handles external HTTP requests and sits behind a load balancer |  |  |
| identity | Handles authentication and identity management |  |  |
| order-management | Handles all activities around orders and the processing of them |  |
| delivery | Manages the physical delivery and tracking of orders |  |  |
| kitchen-manager | Handles the actual creation and cooking of an order |  |
| menu-service | Stock management and menu items |  |
| payment | Payment processing |  |  |