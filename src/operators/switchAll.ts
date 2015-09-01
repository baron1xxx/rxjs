import Operator from '../Operator';
import Observer from '../Observer';
import Observable from '../Observable';
import Subscriber from '../Subscriber';
import Subscription from '../Subscription';
import { MergeSubscriber } from './merge-support';

export default function switchAll<T>(): Observable<T> {
  return this.lift(new SwitchOperator());
}

class SwitchOperator<T, R> implements Operator<T, R> {

  constructor() {
  }

  call(observer: Observer<R>): Observer<T> {
    return new SwitchSubscriber(observer);
  }
}

class SwitchSubscriber<T, R> extends MergeSubscriber<T, R> {

  innerSubscription: Subscription<T>;

  constructor(destination: Observer<R>) {
    super(destination, 1);
  }

  _buffer(value) {
    const active = this.active;
    if(active > 0) {
      this.active = active - 1;
      const inner = this.innerSubscription;
      if(inner) {
        inner.unsubscribe()
      }
    }
    this._next(value);
  }

  _subscribeInner(observable, value, index) {
    return (this.innerSubscription = super._subscribeInner(observable, value, index));
  }
}

