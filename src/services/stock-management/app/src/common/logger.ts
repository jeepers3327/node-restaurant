export interface Logger {
    logInformation(message: string);
    logWarning(message: string);
    logError(message: string, error: Error);
}