import React from "react";
import logo from "../../img/logo.png";
import store from "../../../src/store";
import { logoutUser } from "../../../src/actions/authActions";
const LogoHeader = (props) => {
  //console.log(props);
  const style1 = {
    background: "#00B050",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  };
  const style2 = {
    background: "#00B050",
    paddingTop: "1.25rem",
    paddingBottom: "1.25rem",
  };
  return (
    <div>
      <img src={logo} className="h-20 w-25"></img>
      <div class="flex flex-col">
        <header
          style={props.left || props.right ? style1 : style2}
          className=" text-white"
        >
          <div
            className="flex flex-row"
            style={{
              width: "95%",
              justifyContent: "space-between",
              margin: "auto",
            }}
          >
            <div>
              <b>{props && props.left}</b>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => store.dispatch(logoutUser())}
            >
              <b>{props && props.right ? props.right : ""}</b>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default LogoHeader;
