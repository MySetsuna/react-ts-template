import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  NavLink,
  Route,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { useAuth } from "./providers";
import "./App.less";
import { CounterProvider } from "./providers/CounterProvider";
import React, { memo, Suspense } from "react";
import { ProjectProvider } from "./providers/ProjectProvider";
import { Spin } from "antd";

const LazyLoadDemo = React.lazy(() => import("./components/LazyLoadDemo"));

const Home = React.lazy(() => import("./components/Home/Home"));

const Dashboard = React.lazy(() => import("./components/Dashboard"));

const CounterPage = React.lazy(() => import("./components/CounterPage"));
const CounterXPage = React.lazy(() => import("./components/CounterXPage"));
const ProjectDetail = React.lazy(() => import("./components/ProjectDetail"));
const ProjectDetailMobx = React.lazy(
  () => import("./components/ProjectDetail/ProjectDetailMobx")
);

const StoryList = React.lazy(
  () => import("./components/LazyLoadDemo/components/StoryList/StoryList")
);
const Gantt = React.lazy(
  () => import("./components/LazyLoadDemo/components/Gantt/Gantt")
);

const Manhour = React.lazy(
  () => import("./components/LazyLoadDemo/components/Manhour/Manhour")
);

const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  return <>{error.message}</>;
};

const App = () => {
  console.log("进入程序");

  // 在这里使用context里的数据
  const { userInfo, isLoading } = useAuth();
  // 不要结构使用mobx的action
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        errorElement={
          <>
            404 <NavLink to="/">返回首页</NavLink>
          </>
        }
      >
        <Route path="/" element={<LazyLoadDemo />}>
          <Route path="/list" element={<StoryList />} />
          <Route path="/gantt" element={<Gantt />} />
          <Route path="/manhour" element={<Manhour />} />
          <Route index element={<Navigate to={"/list"} />} />
        </Route>
        <Route
          path="/home"
          // element={<div style={{ fontSize: 150 }}>Welcome!</div>}
          element={<Home />}
        >
          <Route
            index
            element={<div style={{ fontSize: 150 }}>Welcome!</div>}
          />
          <Route
            path="/home/dashboard/:id"
            element={<Dashboard />}
            // 注意!: 不要在Route 的 loader 和 action 中使用上下文相关hooks : useContext以及依赖他实现的hook
            loader={({ params }) => {
              if (
                userInfo.dashboard instanceof Array &&
                userInfo.dashboard.includes(Number(params.id))
              ) {
                return Promise.resolve(userInfo);
              }
              throw new Error("无权限");
            }}
            errorElement={isLoading ? <>Loading...</> : <ErrorBoundary />}
          />
          <Route
            path="/home/counter/:counterNumber?"
            element={<CounterPage />}
          />
          <Route
            path="/home/counterX/:counterNumber?"
            element={<CounterXPage />}
          />
          <Route path="/home/project/:projectId?" element={<ProjectDetail />} />
          <Route
            path="/home/project-mobx/:projectId?"
            element={<ProjectDetailMobx />}
          />
        </Route>
      </Route>
    )
  );
  return (
    <div style={{ height: "100vh", padding: 16 }}>
      <CounterProvider>
        <ProjectProvider defaultProject={4}>
          <Suspense fallback={<Spin />}>
            <RouterProvider router={router} />
          </Suspense>
        </ProjectProvider>
      </CounterProvider>
    </div>
  );
};

export default memo(App);
