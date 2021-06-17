import winston from "winston";
import { Logger } from "../common/logger";

export class WinstonLogger implements Logger {
  private _logger: winston.Logger;

  constructor() {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const level = () => {
      const env = process.env.NODE_ENV || "development";
      const isDevelopment = env === "development";
      return isDevelopment ? "debug" : "warn";
    };

    const colors = {
      error: "red",
      warn: "yellow",
      info: "green",
      http: "magenta",
      debug: "white",
    };

    winston.addColors(colors);

    const format = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    );

    const transports = [
      new winston.transports.Console(),
    ];

    this._logger = winston.createLogger({
      level: level(),
      levels,
      format,
      transports,
    });
  }

  logInformation(message: string) {
    this._logger.info(message);
  }
  logWarning(message: string) {
    this._logger.warn(message);
  }
  logError(message: string, error: Error) {
    this._logger.error(message);
    this._logger.error(error.name);
    this._logger.error(error.message);
  }
}
