export class ApiResponse<T> {
  success= false;
  message = "";
  data: T;

  constructor(success: boolean, message: string, data: T) {
    this.data = data;
    this.success = success;
    this.message = message;
  }
}
