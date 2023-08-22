import { useQuery } from "@tanstack/react-query";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  children: ReactNode;
  defaultProject?: number;
};

export type Project = {
  id: number;
  name?: string;
  owner?: string;
  members?: string[];
};

type ContextValue = {
  projectList: Project[];
  projectInfo: Project;
  changeProject: (pid: number) => void;
  infoLoading: boolean;
};

const mockProjectList = [
  {
    id: 1,
    name: "项目一",
    owner: "Jack",
    members: ["Jack", "John"],
  },
  {
    id: 2,
    name: "项目二",
    owner: "Jack",
    members: ["Jack"],
  },
  {
    id: 3,
    name: "项目三",
    owner: "John",
    members: ["Jack", "John"],
  },
];

const getProjectInfo = (projectId: number) => {
  console.log("请求Project*****************", projectId);

  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      const project = mockProjectList.find(({ id }) => id === projectId);
      if (project) {
        resolve(project);
      } else {
        resolve({ id: projectId });
      }
    }, 1000);
  });
};

const getProjectList = () => {
  return new Promise<Project[]>((resolve) => {
    setTimeout(() => {
      resolve(mockProjectList);
    }, 100);
  });
};

const ProjectContext = createContext<ContextValue | undefined>(undefined);

const ProjectProvider = (props: Props) => {
  const [projectId, setProjectId] = useState(props.defaultProject ?? 0);

  const { data: projectList = [] } = useQuery(["project-list"], () =>
    getProjectList()
  );

  const { data: projectInfo = { id: projectId }, isLoading } =
    useQuery<Project>(
      ["project-info", projectId],
      () => getProjectInfo(projectId),
      { enabled: !!projectId }
    );

  useEffect(() => {
    console.log(projectList, "projectList", projectInfo);

    if (!isLoading) {
      // case1 : 设置的项目ID不存在
      if (projectInfo.id && !projectInfo.name && projectList?.length) {
        console.log("进入ProjectProvider");

        setProjectId(projectList[0].id);
      }

      // case2: 没有设置默认项目ID
      if (!props.defaultProject && projectList?.length && !projectInfo.name) {
        console.log("进入ProjectProvider2");
        setProjectId(projectList[0].id);
      }
    }
  }, [projectList, projectInfo, isLoading]);

  const changeProject = useCallback((pid: number) => {
    setProjectId(pid);
  }, []);

  const contextValue = useMemo(() => {
    return { projectList, projectInfo, changeProject, infoLoading: isLoading };
  }, [projectList, projectInfo, isLoading]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {props.children}
    </ProjectContext.Provider>
  );
};

function useProject() {
  const contextValue = useContext(ProjectContext);
  if (!contextValue) {
    throw new Error("请在ProjectProvider中使用useProject");
  }
  return contextValue;
}

export { ProjectProvider, useProject };