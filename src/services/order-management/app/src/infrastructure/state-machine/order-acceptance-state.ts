import * as stateDef from "./order-acceptance.asl.json"; // import to force ASL definition to be included in compiled files.

export class OrderAcceptanceState {
    input: Input;
    output: Output;
    audit: Audit;

    constructor(customerId: string, orderNumber: string)
    {
        this.input = {
            customerId: customerId,
            orderNumber: orderNumber
        }

        this.audit = {
            startDate: new Date(),
        }

        this.output = new Output();
    }
}

export class Input {
    orderNumber: string;
    customerId: string;
}

export class Output {
    stockCheckSuccess: boolean;
    paymentSuccess: boolean;
    outputMessages: string[];
}

export class Audit {
    startDate: Date;
}