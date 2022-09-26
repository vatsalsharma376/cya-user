import React, { useState } from "react";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { IconContext } from "react-icons";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { AiOutlineDashboard } from "react-icons/ai";

//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";
import Dash from "../dashboard/Dash";
import Template from "../dashboard/Template";

const Header = (props) => {
  //console.log("xyz");
  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };
  const [showDash, setshowDash] = useState(true);
  //console.log("okay");
  return (
    <div className="flex flex-row">
      <div className="ri8">
        {showDash === true ? <Dash props={props} /> : <Template {...props} />}
      </div>
    </div>
  );
};

export default Header;
