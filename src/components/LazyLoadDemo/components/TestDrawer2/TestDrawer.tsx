import { Image } from "antd";

const TestDrawer2 = () => {
  // 增加延迟
  // let startTime = 1000000000;
  // while (startTime > 1) {
  //   // Do nothing for 1 ms per item to emulate extremely slow code
  //   startTime--;
  // }
  return (
    <div
      style={{ fontSize: 30, height: 100, textAlign: "center", marginTop: 20 }}
      title={"需求详情页"}
    >
      <hr />
      需求详情页
      <Image src="/example7.jpg" height={200} />
    </div>
  );
};
export default TestDrawer2;
