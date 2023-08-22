import { memo } from "react";
import { useLoaderData, useParams } from "react-router";

const Dashboard = () => {
  const userInfo = useLoaderData();
  const { id } = useParams();
  return (
    <div>
      Dashboard:{id}
      <br />
      User: {JSON.stringify(userInfo)}
    </div>
  );
};

export default memo(Dashboard);
