export abstract class CommandResult {
    rowsAffected: number;
    friendlyMessage: string;
    success: boolean;
    data: string;
}