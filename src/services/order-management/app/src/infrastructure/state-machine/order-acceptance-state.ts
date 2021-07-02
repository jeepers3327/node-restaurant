import { IOrder } from "../../domain/entities/order";
import * as stateDef from "./order-acceptance.asl.json"; // import to force ASL definition to be included in compiled files.

export class OrderAcceptanceState {
    input: Input;
    output: Output;
    audit: Audit;

    constructor(order: IOrder)
    {
        this.input = {
            order: order
        }

        this.audit = {
            startDate: new Date(),
        }

        this.output = new Output();
    }
}

export class Input {
    order: IOrder
}

export class Output {
    stockCheckSuccess: boolean;
    paymentSuccess: boolean;
    outputMessages: string[] = [];
}

export class Audit {
    startDate: Date;
}