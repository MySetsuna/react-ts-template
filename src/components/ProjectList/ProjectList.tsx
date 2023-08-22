import { Project, useProject } from "@/providers/ProjectProvider";
import { useNavigate } from "react-router";

const ProjectList = () => {
  const { projectInfo, projectList, changeProject } = useProject();
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", gap: 15 }}>
      {projectList.map((project: Project) => {
        return (
          <div
            key={project.id}
            style={{
              height: 80,
              width: 90,
              border:
                projectInfo.id === project.id
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
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
