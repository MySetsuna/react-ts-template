import { runInAction } from "mobx";
import { useEffect } from "react";
import { useParams } from "react-router";
import { observer } from "mobx-react";
import { useCounter } from "@/providers/CounterProvider";
import { Button } from "antd";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const CounterXPage = () => {
  const { counterNumber } = useParams();
  const counterStore = useCounter();
  useEffect(() => {
    console.log(counterNumber, "counterNumber");
    runInAction(() => (counterStore.value = Number(counterNumber) || 0));
  }, [counterNumber]);
  return (
    <>
      <div>CounterXPage</div>
      <div style={{ fontSize: 100, textAlign: "center", color: "wheat" }}>
        <Button onClick={() => counterStore.decreases()}>-</Button>
        <span>{counterStore.value}</span>
        <Button onClick={() => counterStore.increment()}>+</Button>
      </div>
    </>
  );
};

export default observer(CounterXPage);
