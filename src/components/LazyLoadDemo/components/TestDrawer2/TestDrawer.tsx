import { Drawer } from "antd";

type Props = { open: boolean; onClose: () => void };

const TestDrawer2 = (props: Props) => {
  // 增加延迟
  let startTime = 1000000000;
  while (startTime > 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
    startTime--;
  }
  return <div title={"需求详情页"}>需求详情页</div>;
};
export default TestDrawer2;
