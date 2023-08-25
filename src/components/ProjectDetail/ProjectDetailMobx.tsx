import { Project, getProjectInfo } from "@/providers";
import { Spin } from "antd";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import { useParams } from "react-router";
import { useEffect } from "react";

// const counterStore = createCounter(0)
/**
 * @description 组件内mobx使用示例
 * @returns
 */
const ProjectDetailMobx = () => {
  const { projectId } = useParams();

  const store = useLocalObservable(() => ({
    loading: false,
    projectInfo: {} as Project,
    initData(projectId: string) {
      runInAction(() => (this.loading = true));
      getProjectInfo(Number(projectId)).then((data) => {
        runInAction(() => {
          this.projectInfo = data;
          this.loading = false;
        });
      });
    },
  }));

  useEffect(() => {
    if (projectId) {
      store.initData(projectId);
    }
  }, [store, projectId]);

  return (
    <>
      <div style={{ fontSize: 20, color: "lightsalmon" }}>
        ProjectDetail Mobx
      </div>
      <Spin spinning={store.loading}>
        <div style={{ fontSize: 50, textAlign: "center", color: "wheat" }}>
          <span style={{ fontSize: 100 }}> {store.projectInfo.name}</span>
          <br />
          owner : {store.projectInfo.owner}
          <br />
          members : {store.projectInfo.members?.join(",")}
        </div>
      </Spin>
    </>
  );
};

export default observer(ProjectDetailMobx);
