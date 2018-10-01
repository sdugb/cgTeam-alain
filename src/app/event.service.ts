import {Component, Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class EventService {
    change: EventEmitter<number>;

    constructor() {
        this.change = new EventEmitter();
    }
}
