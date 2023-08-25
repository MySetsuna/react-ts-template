import { createCounter } from "@/stores/Counter";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { useParams } from "react-router";
import { observer, useLocalObservable } from "mobx-react";
import { Counter } from "@/providers";
import { Button } from "antd";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const CounterPage = () => {
  const { counterNumber } = useParams();
  const counterStore: Counter = useLocalObservable(() => createCounter(0));

  useEffect(() => {
    console.log(counterNumber, "counterNumber");
    runInAction(() => (counterStore.value = Number(counterNumber) || 0));
  }, [counterNumber]);
  return (
    <>
      <div>CounterPage</div>
      <div style={{ fontSize: 100, textAlign: "center", color: "wheat" }}>
        <Button onClick={() => counterStore.decreases()}>-</Button>
        <span>{counterStore.value}</span>
        <Button onClick={() => counterStore.increment()}>+</Button>
      </div>
    </>
  );
};

export default observer(CounterPage);
