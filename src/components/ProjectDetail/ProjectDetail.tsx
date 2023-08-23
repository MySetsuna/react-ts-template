import { useProject } from "@/providers/ProjectProvider";
import { Spin } from "antd";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const ProjectDetail = () => {
  const { projectInfo, infoLoading } = useProject();

  return (
    <>
      <div style={{ fontSize: 20, color: "lightsalmon" }}>ProjectDetail</div>
      <Spin spinning={infoLoading}>
        <div style={{ fontSize: 50, textAlign: "center", color: "wheat" }}>
          <span style={{ fontSize: 100 }}> {projectInfo.name}</span>
          <br />
          owner : {projectInfo.owner}
          <br />
          members : {projectInfo.members?.join(",")}
        </div>
      </Spin>
    </>
  );
};

export default ProjectDetail;
