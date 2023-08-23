import { Drawer } from "antd";

type Props = { open: boolean; onClose: () => void };

const TestDrawer = (props: Props) => {
  // 增加延迟
  const startTime = performance.now();
  // while (performance.now() - startTime < 1) {
  //   // Do nothing for 1 ms per item to emulate extremely slow code
  // }
  return (
    <Drawer onClose={props.onClose} open={props.open} title={"需求详情页"}>
      需求详情页
    </Drawer>
  );
};
export default TestDrawer;
