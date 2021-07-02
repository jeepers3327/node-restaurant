# node-restaurant

## Overview

Sample NodeJS application built using Domain Driven Design principles and an event driven serverless architecture.

The intent of the application is for managing a plant-based pizza takeaway restaurant. More detail can be found in docs/design.md, but broadly speaking the system should be able to:

- Take orders
- Track the available menu items and stock
- Process payments
- Manage deliveries
- Aid the kitchen in creating and cooking the pizzas

From a technical perspective, the intent of the application is to:

### Domain Driven Design

How the principles of DDD can be applied to a codebase to make the code easy to understand and change.

For me, a fundamental part of good system design is being able to talk to business domain experts about the code base, using a ubiqutous language. Ensure the structure and naming of the code correspondes with the language used in the domain

### Clean Architecture

How a well structed code base helps development and maleability of a system. For example, ensuring any database interactions are implemented at the outer edge of the system. The Domain code only needs know about the fact that there is a repository of orders, but not which DynamoDB comamnd is used to retrieve them or even which database provider is being used.

### Serverless

How serverless, for me, has become the de-facto way of building applications in all but the most specific use cases.

From developer experience, through to the services offered by the big cloud providers. In the single mono-repo I've tried to include implementations from AWS, GCloud and Azure to demonstrate how the different providers manage different scenarios.

This also feeds back into DDD and Clean Architecture principles, in that the entire system can be easily switched from one provider to the other. The core part of the code base, the business logic, is incredibly interchangeable.

### Learn

Software development is a constant learning journey, having a 'real-world' application ready built to practice and test new concepts is an invaluable tool in continuous improvement. 

