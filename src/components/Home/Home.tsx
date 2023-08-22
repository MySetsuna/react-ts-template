import { useAuth } from "@/providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Home.less";
import { type UserInfo } from "@/types";
import { THEME_INFO, USER_INFO } from "@/constant/api";
import { observer } from "mobx-react";
import { useCounter } from "@/providers/CounterProvider";
import { Button, Card, Col, Input, Row, Select, Space } from "antd";
import { useTheme } from "@/providers/ThemeProvider";
import { useProject } from "@/providers/ProjectProvider";
import ProjectList from "../ProjectList";

const postUserInfo = async () => {
  return await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const postTheme = async () => {
  return await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const Home = () => {
  const { changeUser, userInfo } = useAuth();

  const [counterNumber, setCounterNumber] = useState<number | string>("");
  const [counterXNumber, setCounterXNumber] = useState<number | string>("");
  const [toChangUserName, setToChangUserName] = useState(userInfo.name ?? "");
  const [toChangeUserDashboard, setToChangeDashboard] = useState(
    userInfo.dashboard?.join(",") ?? ""
  );

  const { background } = useTheme();

  const navigate = useNavigate();

  // 不要解构使用action 等方法
  const counterStore = useCounter();

  const { projectList, projectInfo, changeProject } = useProject();

  const queryClient = useQueryClient();
  // 修改
  const mutation = useMutation<boolean, Error, UserInfo>({
    mutationFn: postUserInfo,
    // onMutate(variables) {
    //   queryClient.setQueryData<UserInfo>([USER_INFO, userInfo.name], (preUserInfo) =>
    //     Object.assign({}, preUserInfo, { dashboard: variables })
    //   )
    // },
    onSuccess: (_data, variables) => {
      // 错误处理和刷新
      // 从后台获取
      // queryClient.invalidateQueries([USER_INFO, userInfo.name])
      // 前端直接改
      queryClient.setQueryData<UserInfo>(
        [USER_INFO, userInfo.name],
        (preUserInfo) => Object.assign({}, preUserInfo, variables)
      );
    },
  });

  const themeMutation = useMutation<boolean, Error, { background: string }>({
    mutationFn: postTheme,
    onMutate(variables) {
      queryClient.setQueryData<{ background: string }>(
        [THEME_INFO, userInfo.name],
        (oldTheme) => Object.assign({}, oldTheme, variables)
      );
    },
    onSuccess: (_data, variables) => {
      // 错误处理和刷新
      // 从后台获取
      // queryClient.invalidateQueries([THEME_INFO, userInfo.name])

      // 目前前端直接改
      queryClient.setQueryData<{ background: string }>(
        [THEME_INFO, userInfo.name],
        (oldTheme) => Object.assign({}, oldTheme, variables)
      );
    },
  });

  useEffect(() => {
    setToChangUserName(userInfo.name ?? "");
    setToChangeDashboard(userInfo.dashboard?.join(",") ?? "");
  }, [userInfo]);

  useEffect(() => {
    setCounterXNumber(counterStore.value);
  }, [counterStore.value]);

  const navLinkClass = useCallback(
    ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
      isPending ? "pending" : isActive ? "active" : "",
    []
  );
  return (
    <div>
      首页 用户:{userInfo?.name}
      <Card bodyStyle={{ background, color: "white" }}>
        <Row gutter={18}>
          <Col span={7}>
            <Space wrap>
              <Button>
                <NavLink className={navLinkClass} to="/dashboard/1">
                  dashboard1
                </NavLink>
              </Button>
              <br />
              <Button>
                <NavLink className={navLinkClass} to="/dashboard/2">
                  dashboard2
                </NavLink>
              </Button>
              <br />
              <Button>
                <NavLink className={navLinkClass} to="/">
                  返回
                </NavLink>
              </Button>
            </Space>
            <Card style={{ marginTop: 10 }}>
              项目选择 :
              <Select
                value={projectInfo.id ? projectInfo.id : undefined}
                options={projectList.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                onChange={changeProject}
              />
            </Card>
          </Col>
          <Col span={7}>
            <Space wrap>
              <div>
                变更背景色
                <input
                  type="color"
                  onChange={(e) => {
                    themeMutation.mutate({ background: e.target.value });
                  }}
                />
              </div>
              <div>
                变更用户 :
                <Input
                  placeholder="用户Id..."
                  value={toChangUserName}
                  onChange={(e) => setToChangUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter" && toChangUserName) {
                      changeUser(toChangUserName);
                    }
                  }}
                />
                <Button onClick={() => changeUser(toChangUserName)}>
                  确认
                </Button>
              </div>
              <div>
                变更Dashboard权限 :
                <Input
                  placeholder="权限Id,用','隔开"
                  value={toChangeUserDashboard}
                  onChange={(e) => setToChangeDashboard(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      mutation.mutate({
                        dashboard:
                          toChangeUserDashboard
                            .split(",")
                            .filter((item) => item)
                            .map(Number) ?? [],
                      });
                    }
                  }}
                />
                <Button
                  onClick={() =>
                    mutation.mutate({
                      dashboard:
                        toChangeUserDashboard
                          .split(",")
                          .filter((item) => item)
                          .map(Number) ?? [],
                    })
                  }
                >
                  确认
                </Button>
              </div>
            </Space>
          </Col>
          <Col span={7}>
            <Space wrap>
              <div>
                <span>跳转CounterPage(组件内mobx) : </span>
                <Input
                  type="number"
                  value={counterNumber}
                  onChange={(e) => {
                    setCounterNumber(
                      e.target.value ? Number(e.target.value) : ""
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      navigate(`/counter/${counterNumber}`);
                    }
                  }}
                />
                <Button>
                  <NavLink
                    className={navLinkClass}
                    to={`/counter/${counterNumber}`}
                  >
                    跳转
                  </NavLink>
                </Button>
              </div>
              <div>
                <span>跳转CounterXPage(领域/全局mobx) : </span>
                <Input
                  type="number"
                  value={counterXNumber}
                  onChange={(e) => {
                    setCounterXNumber(
                      e.target.value ? Number(e.target.value) : ""
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      navigate(`/counterX/${counterXNumber}`);
                    }
                  }}
                />
                <Button>
                  <NavLink
                    className={navLinkClass}
                    to={`/counterX/${counterXNumber}`}
                  >
                    跳转
                  </NavLink>
                </Button>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card bodyStyle={{ background, color: "pink" }} style={{ marginTop: 20 }}>
        <ProjectList />
      </Card>
      <Card bodyStyle={{ background, color: "pink" }} style={{ marginTop: 20 }}>
        <Outlet />
      </Card>
    </div>
  );
};

export default observer(Home);
