import { createCounter } from "@/stores/Counter";
import { ReactNode, createContext, useContext, useState } from "react";

export type Counter =
  | {
      value: number;
      readonly double: number;
      increment(): void;
      decreases(): void;
    }
  | undefined;

export const CounterContext = createContext<Counter>(undefined);
type Props = {
  children: ReactNode;
};

const CounterProvider = (props: Props) => {
  const [store] = useState(createCounter(0));
  return (
    <CounterContext.Provider value={store}>
      {props.children}
    </CounterContext.Provider>
  );
};

function useCounter() {
  const contextValue = useContext(CounterContext);
  if (!contextValue) {
    throw new Error("请在CounterProvider中使用useCounter");
  }
  return contextValue;
}

export { CounterProvider, useCounter };
