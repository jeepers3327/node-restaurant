import { Logger } from "../common/logger";

export interface StockReservationRequest {
  menuItemName: string;
}

export class StockReservationHandler {
  private _logger: Logger;
  constructor(logger: Logger) {
    this._logger = logger;
  }

  async execute(request: StockReservationRequest) {
    this._logger.logInformation(
      `Starting stock reservation check for ${request.menuItemName}`
    );
  }
}
