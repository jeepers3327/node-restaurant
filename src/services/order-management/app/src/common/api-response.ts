import { ApiGatewayResponse } from "./apigateway/apigateway-response";

export class ApiResponse<T> {
  success= false;
  message = "";
  data: T;

  constructor(success: boolean, message: string, data: T) {
    this.data = data;
    this.success = success;
    this.message = message;
  }

  respond(): ApiGatewayResponse{
      return {
          statusCode: this.success ? 200 : 400,
          body: JSON.stringify(this)
      }
  }
}
