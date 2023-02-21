import { Component } from 'react';

export interface IBaseAction {
    Publish(data: any): void;
    Subscribe(el: Component): void;
    UnSubscribe(el: Component): void;
}

export class BaseAction<T> implements IBaseAction {
    private Subscribers: Component[];

    constructor() {
        this.Subscribers = [];
    }

    public Publish(data: T) {
        for (let member of this.Subscribers) {
            member.setState(data);
        }
    }

    public Subscribe(el: Component) {
        this.Subscribers.push(el);
    }

    public UnSubscribe(el: Component) {
        //
    }
}
