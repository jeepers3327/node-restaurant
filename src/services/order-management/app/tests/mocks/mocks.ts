import { Event, Events } from "../../src/core/events/events";
export class MockEventBus implements Events {
  constructor() {}
    roar(): void {
        throw new Error("Method not implemented.");
    }
  async publish(evt: Event): Promise<void> {
    return new Promise((res) => {
      return res();
    });
  }
}
