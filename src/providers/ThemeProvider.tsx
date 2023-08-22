import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { THEME_INFO } from "@/constant/api";
import { getThemeByUserId } from "@/api/theme";

type Props = {
  children: ReactNode;
};

type ThemeContextValue = { background: string } | undefined;

const ThemeContext = createContext<ThemeContextValue>(undefined);

const ThemeProvider = (props: Props) => {
  const { userInfo } = useAuth();
  const { data: themeData = { background: "rgb(47, 50, 65,0.8)" } } = useQuery(
    [THEME_INFO, userInfo.name],
    () => getThemeByUserId(userInfo.name ?? ""),
    {
      enabled: !!userInfo.name,
    }
  );
  const { background } = themeData;

  return (
    <ThemeContext.Provider value={themeData}>
      <div style={{ background }}>{props.children}</div>
    </ThemeContext.Provider>
  );
};
function useTheme() {
  const contextValue = useContext(ThemeContext);
  if (!contextValue) {
    throw new Error("请在ThemeProvider中使用useTheme");
  }
  return contextValue;
}

export { useTheme, ThemeProvider };
