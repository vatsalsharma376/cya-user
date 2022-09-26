import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";
import LogoHeader from "../layout/LogoHeader";
import store from "../../../src/store";
import { registerUser } from "../../actions/authActions";
import { Fragment } from "react";
const space = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>;
const Payroll = (props) => {
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push("/dash");
    }
  }, [props.auth.isAuthenticated]);
  const handleChange = (e) => {
    const curst = props.location.state;
    if (e.target.value === "choose") {
      alert("Please select a choice");
    } else {
      const userInfo = props.location.state;
      userInfo.companyId = localStorage.getItem("company");
      //console.log(userInfo);
      props.registerUser(userInfo, props.history);
    }
  };
  return (
    <>
      <LogoHeader />

      <div className="flex container">
        <div className="ml-20">
          <p>Let's begin!</p>
          <br />
          <p className="text-gray-500">
            Which payroll company does your business use? {space}
            {space}
            {space}
            {space}
            <select
              id="dropdown"
              className="border-2 border-green-500"
              onChange={handleChange}
            >
              <option value="choose">---Choose one---</option>
              <option value="adp">ADP</option>
              <option value="paychx">Paychex</option>
              <option value="workday">Workday</option>
              <option value="other">Other</option>
            </select>
          </p>
        </div>
      </div>
    </>
  );
};

Payroll.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(Payroll);
