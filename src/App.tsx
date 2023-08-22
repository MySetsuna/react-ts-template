import {
  createBrowserRouter,
  createRoutesFromElements,
  NavLink,
  Route,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import Home from "./components/Home/Home";
import { useAuth } from "./providers";
import Dashboard from "./components/Dashboard";
import "./App.less";
import CounterPage from "./components/CounterPage";
import { CounterProvider } from "./providers/CounterProvider";
import CounterXPage from "./components/CounterXPage";
import { memo } from "react";
import { ProjectProvider } from "./providers/ProjectProvider";
import ProjectDetail from "./components/ProjectDetail";

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
        element={<Home />}
        errorElement={
          <>
            404 <NavLink to="/">返回首页</NavLink>
          </>
        }
      >
        <Route
          path="/dashboard/:id"
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
        <Route path="/counter/:counterNumber?" element={<CounterPage />} />
        <Route path="/counterX/:counterNumber?" element={<CounterXPage />} />
        <Route path="/project/:projectId?" element={<ProjectDetail />} />
      </Route>
    )
  );
  return (
    <div style={{ height: "100vh", padding: 16 }}>
      <CounterProvider>
        <ProjectProvider defaultProject={4}>
          <RouterProvider router={router} />
        </ProjectProvider>
      </CounterProvider>
    </div>
  );
};

export default memo(App);
