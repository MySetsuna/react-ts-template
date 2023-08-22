import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/types";
import { getUserInfo } from "@/api/user";
import { USER_INFO } from "@/constant/api";

type Props = {
  children: ReactNode;
  defaultUser?: string;
};

type AuthContextValue =
  | {
      changeUser: (userName: string) => void;
      login: () => void;
      userInfo: UserInfo;
      isLoading: boolean;
      isError: boolean;
    }
  | undefined;

const AuthContext = createContext<AuthContextValue>(undefined);

const AuthProvider = (props: Props) => {
  // to set Defult User
  const [userId, setUserId] = useState<string>(props.defaultUser ?? "Jack");

  useEffect(() => {
    setUserId("Jack");
  }, []);

  const {
    data: userInfo = { name: userId },
    isLoading,
    isError,
  } = useQuery([USER_INFO, userId], () => getUserInfo(userId), {
    enabled: !!userId,
  });

  const login = useCallback(() => {}, []);
  const changeUser = useCallback((userName: string) => {
    setUserId(userName);
  }, []);

  const contextValue = useMemo(() => {
    return { login, changeUser, userInfo, isLoading, isError };
  }, [userInfo]);
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error("请在AuthProvider中使用useAuth");
  }
  return contextValue;
}

export { useAuth, AuthProvider };
