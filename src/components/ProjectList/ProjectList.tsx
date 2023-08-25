import { Project, useProject } from "@/providers";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router";

const ProjectList = () => {
  const { projectInfo, projectList, changeProject, clearMembers } =
    useProject();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div style={{ display: "flex", gap: 15 }}>
      react qurey 管理:
      {projectList.map((project: Project) => {
        return (
          <div
            key={project.id}
            style={{
              height: 80,
              width: 90,
              border:
                projectInfo.id === project.id &&
                pathname.includes("project") &&
                !pathname.includes("mobx")
                  ? "solid pink 3px"
                  : "solid white 1px",
            }}
            onClick={() => {
              changeProject(project.id);
              navigate(`./project/${project.id}`);
            }}
          >
            {project.name}
            <br />
            {project.owner}
            <br />
            {project.members?.join(",")}
          </div>
        );
      })}
      <Button onClick={() => clearMembers()}>清空/重置所有项目成员</Button>
      <div style={{ display: "flex", gap: 15 }}>
        mobx 管理:
        {projectList.map((project: Project) => {
          return (
            <div
              key={project.id}
              style={{
                height: 80,
                width: 90,
                border:
                  projectInfo.id === project.id &&
                  pathname.includes("project-mobx")
                    ? "solid red 3px"
                    : "solid white 1px",
              }}
              onClick={() => {
                changeProject(project.id);
                navigate(`./project-mobx/${project.id}`);
              }}
            >
              {project.name}
              <br />
              {project.owner}
              <br />
              {project.members?.join(",")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
