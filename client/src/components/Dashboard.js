// third party imports
import * as React from "react";
import { useNavigate } from "react-router";

// css imports
import "../css/dashboard.css";

// file imports
import SharePersonally from "./SharePersonally";
import ShareGlobally from "./ShareGlobally";
import stringAvatar from "../utils/Avatar";
import check_login from "../utils/check_login";

// mui imports
import { Avatar } from "@mui/material";

const Dashboard = () => {
  
  let navigate = useNavigate();

  React.useEffect(async () => {
    const userAddress = await check_login();
    if (userAddress == 0) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="dashboard">
      <SharePersonally />
      <div>
        <Avatar {...stringAvatar("Profile User")} className="avatar" />
        <h4 style={{ textAlign: "center" }}>
          <strong>Profile User</strong>
        </h4>
        <h5 style={{ textAlign: "center" }}>
          <strong>*$(#@_@@*$#(</strong>
        </h5>
      </div>
      <ShareGlobally />
    </div>
  );
};

export default Dashboard;
