export const getThemeByUserId = async (userId: string) => {
  console.log(userId, "theme");

  return new Promise<{ background: string }>((resolve) => {
    setTimeout(() => {
      resolve({ background: "#2f3241" });
    }, 500);
  });
};
