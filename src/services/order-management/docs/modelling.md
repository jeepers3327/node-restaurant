# Data Modelling

Two core elements of an the order domain

## Order

The high level information about the order
- customerId
- orderNumber
- orderDate
- status
- deliveryAddress
- deliveryType
- orderItems[]

## Order Item

The contents of the order
- description
- quantity
- price

Order -> OrderItem is a one to many relationship.