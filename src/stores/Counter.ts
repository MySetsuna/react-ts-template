import { makeAutoObservable } from "mobx";

export function createCounter(value: number) {
  return makeAutoObservable({
    value,
    get double() {
      return this.value * 2;
    },
    increment() {
      this.value++;
    },
    decreases() {
      this.value--;
    },
  });
}
