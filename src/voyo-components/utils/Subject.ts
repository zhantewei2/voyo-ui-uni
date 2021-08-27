export interface SubjectOrder<T> {
  id: number;
  cb: (value: T) => void;
  unsubscribe: () => void;
}

export class Subject<T> {
  id: number = 0;
  orderList: SubjectOrder<T>[] = [];

  next(v: T) {
    this.orderList.forEach((i: SubjectOrder<T>) => {
      i.cb(v);
    })
  }

  subscribe(cb: (value: T) => void):SubjectOrder<T> {
    const id = ++this.id;
    const order: SubjectOrder<T> = {
      id,
      cb,
      unsubscribe: () => this.unsubscribe(id)
    };
    this.orderList.push(order);
    return order;
  }

  unsubscribe(itemId: number) {
    const itemIndex: number = this.orderList.findIndex((i: SubjectOrder<T>) => i.id === itemId);
    if (itemIndex >= 0) this.orderList.splice(itemIndex, 1);
  }
}