export interface Events {
    publish (evt: Event) : Promise<void>;
    roar(): void;
}

export abstract class Event {
    abstract get name(): string;
}