import {
  createBrowserRouter,
  createRoutesFromElements,
  NavLink,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.less";
import { memo, Suspense } from "react";
import { useAuth } from "./providers/AuthProvider";

const App = () => {
  console.log("进入程序");

  // 在这里使用context里的数据
  const { userInfo, isLoading } = useAuth();
  console.log(userInfo, isLoading);

  // 不要结构使用mobx的action
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <>
            <div className="test"></div>
            <div className="test2"></div>
            <div className="test3"></div>
          </>
        }
        errorElement={
          <>
            404 <NavLink to="/">返回首页</NavLink>
          </>
        }
      ></Route>
    )
  );
  return (
    <Suspense fallback={"loading..."}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default memo(App);
