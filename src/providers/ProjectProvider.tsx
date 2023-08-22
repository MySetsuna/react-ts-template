import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  clearMembers: () => void;
};

window.clear = false;
const mockProjectList = () =>
  !window.clear
    ? [
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
      ]
    : [
        {
          id: 1,
          name: "项目一",
          owner: "Jack",
          members: [],
        },
        {
          id: 2,
          name: "项目二",
          owner: "Jack",
          members: [],
        },
        {
          id: 3,
          name: "项目三",
          owner: "John",
          members: [],
        },
      ];

export const getProjectInfo = (projectId: number) => {
  console.log("请求Project*****************", projectId);

  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      const project = mockProjectList().find(({ id }) => id === projectId);
      if (project) {
        resolve(project);
      } else {
        resolve({ id: projectId });
      }
    }, 500);
  });
};

const getProjectList = () => {
  return new Promise<Project[]>((resolve) => {
    setTimeout(() => {
      resolve(mockProjectList());
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

  const queryClient = useQueryClient();

  const mutation = useMutation<boolean, Error, Project[]>({
    mutationFn: () => Promise.resolve(true),
    onSuccess: () => {
      // 错误处理和刷新
      // 从后台获取
      window.clear = !window.clear;
      queryClient.invalidateQueries(["project-list"]);
      queryClient.invalidateQueries(["project-info", projectId]);
      // 前端直接改
      //   queryClient.setQueryData<Project[]>(["project-list"], (old) =>
      //     mockProjectList.map((item) => ({ ...item, members: [] }))
      //   );
    },
  });

  const clearMembers = useCallback(() => {
    mutation.mutate([]);
  }, [mutation]);

  const contextValue = useMemo(() => {
    return {
      projectList,
      projectInfo,
      changeProject,
      infoLoading: isLoading,
      clearMembers,
    };
  }, [projectList, projectInfo, isLoading, clearMembers]);

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
