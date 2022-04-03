// third party imports
import ReactDOM from "react-dom";
import * as React from "react";
import { useNavigate } from "react-router";

// file imports
import SharedFiles from "./SharedFiles";
import stringAvatar from "../utils/Avatar";
import check_login from "../utils/check_login";

// mui imports
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

function Interface() {

  let navigate = useNavigate();

  React.useEffect(async () => {
    const userAddress = await check_login();
    if (userAddress == 0) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div>
      <div>
        <div text="container" className="text-center my-3">
          <h3>Sent files</h3>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: "2em",
          }}
        >
          <div>
            <Avatar {...stringAvatar("Shrayash Prasad")} />
            <h4 style={{ textAlign: "center" }}> Shrayash Prasad</h4>
            <h5 style={{ textAlign: "center" }}> *@)#@_$@_(#@</h5>
          </div>
          <SharedFiles />
          <div>
            <Avatar {...stringAvatar("Siddharth Singh Rana")} />
            <h4 style={{ textAlign: "center" }}> Siddharth Singh Rana</h4>
            <h5 style={{ textAlign: "center" }}> *$(#@_@@*$#(</h5>
          </div>
        </div>
        <div className="container text-center">
          <Button
            size="large"
            variant="contained"
            color="success"
            component="label"
          >
            Send file
            <input type="file" hidden />
          </Button>
        </div>
        <div
          text="container"
          className="text-center"
          style={{ marginTop: "2em" }}
        >
          <h3>Received files</h3>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "auto", width: "40%" }}>
          {" "}
          <SharedFiles />
        </div>
      </div>
    </div>
  );
}

export default Interface;
