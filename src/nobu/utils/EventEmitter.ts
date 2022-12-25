import { EventEmitter as IEventEmitter } from "events";
import TypedEmitter, { EventMap } from "typed-emitter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<T extends EventMap = any> extends (IEventEmitter as {
    new <T extends EventMap>(): TypedEmitter<T>;
})<T> {}
