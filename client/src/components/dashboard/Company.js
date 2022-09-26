import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";
import LogoHeader from "../layout/LogoHeader";
import store from "../../../src/store";
import { registerUser } from "../../actions/authActions";
import Select from "react-select";
import { Fragment } from "react";
const space = <Fragment>&nbsp;&nbsp;&nbsp;&nbsp;</Fragment>;
const states = [
  { value: "Alabama", label: "Alabama" },
  { value: "Alaska", label: "Alaska" },
  { value: "Arizona", label: "Arizona" },
  { value: "Arkansas", label: "Arkansas" },
  { value: "California", label: "California" },
  { value: "Colorado", label: "Colorado" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "Delaware", label: "Delaware" },
  { value: "Florida", label: "Florida" },
  { value: "Georgia", label: "Georgia" },
  { value: "Hawaii", label: "Hawaii" },
  { value: "Idaho", label: "Idaho" },
  { value: "Illinois", label: "Illinois" },
  { value: "Indiana", label: "Indiana" },
  { value: "Iowa", label: "Iowa" },
  { value: "Kansas", label: "Kansas" },
  { value: "Kentucky", label: "Kentucky" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Maine", label: "Maine" },
  { value: "Maryland", label: "Maryland" },
  { value: "Massachusetts", label: "Massachusetts" },
  { value: "Michigan", label: "Michigan" },
  { value: "Minnesota", label: "Minnesota" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Missouri", label: "Missouri" },
  { value: "Montana", label: "Montana" },
  { value: "Nebraska", label: "Nebraska" },
  { value: "Nevada", label: "Nevada" },
  { value: "New Hampshire", label: "New Hampshire" },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Mexico", label: "New Mexico" },
  { value: "New York", label: "New York" },
  { value: "North Carolina", label: "North Carolina" },
  { value: "North Dakota", label: "North Dakota" },
  { value: "Ohio", label: "Ohio" },
  { value: "Oklahoma", label: "Oklahoma" },
  { value: "Oregon", label: "Oregon" },
  { value: "Pennsylvania", label: "Pennsylvania" },
  { value: "Rhode Island", label: "Rhode Island" },
  { value: "South Carolina", label: "South Carolina" },
  { value: "South Dakota", label: "South Dakota" },
  { value: "Tennessee", label: "Tennessee" },
  { value: "Texas", label: "Texas" },
  { value: "Utah", label: "Utah" },
  { value: "Vermont", label: "Vermont" },
  { value: "Virginia", label: "Virginia" },
  { value: "Washington", label: "Washington" },
  { value: "West Virginia", label: "West Virginia" },
  { value: "Wisconsin", label: "Wisconsin" },
  { value: "Wyoming", label: "Wyoming" },
];
var selectedStates = null;
const borderColor = "#A2C987";
var curUser = "";
class Company extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      username: "",
      ein: "",
      selectedOptions: null,
      showConfirmation: false,
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Company page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }
    store.subscribe(() => {
      // When state will be updated(in our case, when items will be fetched),
      // we will update local component state and force component to rerender
      // with new data.
      curUser = store.getState();
      //console.log(curUser);
      //this.setState({ username: curUser.name.split()[0] });
    });
    this.setState({ username: this.props.location.state.fname });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    //console.log(this.state.email,this.state.password);
  };

  onSubmit = (e) => {
    e.preventDefault();
    const companyData = {
      name: this.state.name,
      ein: this.state.ein,
      states: selectedStates,
    };
    // send company data to backedn and store in db
    localStorage.setItem("company", companyData.name);
    axios.post("/api/plaid/CreateCompany", companyData);
    const fullUser = this.props.location.state;
    //console.log(this.props.location.state);
    this.props.history.push({
      pathname: "/payroll",
      state: fullUser,
    });
  };

  render() {
    const handleSelectChange = (event) => {
      const curstates = [];
      event.map((event) => {
        curstates.push(event.value);
      });
      selectedStates = curstates;
    };
    return (
      <>
        <LogoHeader />
        {this.state.showConfirmation === true ? (
          <div className="intro ml-20">
            <p>We just created your company profile</p>
            <br />
            <p className="text-gray-600">
              <p style={{ width: "100%" }}>
                You signed up with ClaimYourAid.com so we can look for Grants,
                Credits, and Refunds that your business qualifies for. To do so
                most effectively, it is important to map your company systems to
                ClaimYourAid.com so we can periodically update your information
                on record in order to find the latest programs your business
                qualifies for.
              </p>
            </p>

            <div className="container flex content-center ">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}
              {space}

              <button
                style={{
                  justifyContent: "center",
                  width: "30%",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  backgroundColor: "#00B050",
                }}
                onClick={this.onSubmit}
                type="submit"
                className="w-full text-white font-bold py-2 px-4 rounded"
              >
                Click here to continue
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="py-1 ml-20">
              Welcome {this.state.username}
              <br />
              <br />
              <label className="text-gray-500">
                Let’s create your company profile so we can match Grants,
                Credits, and Refunds to your business:
              </label>
            </div>
            <div className="container flex content-center ">
              <div
                style={{ marginTop: "0.25rem", borderColor: borderColor }}
                className="max-w-xl w-full m-auto border-4 rounded p-5"
              >
                <div className="col s8 offset-s2">
                  <br />
                  <form
                    noValidate
                    onSubmit={() => this.setState({ showConfirmation: true })}
                  >
                    <div className="input-field col s12">
                      <label className="block mb-2 text-gray-500">
                        Official Company name
                      </label>

                      <input
                        required
                        onChange={this.onChange}
                        value={this.state.name}
                        id="name"
                        type="text"
                        style={{ borderColor: borderColor }}
                        className={classnames(
                          "w-full p-2 mb-6 text-gray-700 border-2 outline-none"
                        )}
                      />
                    </div>
                    <div className="input-field col s12">
                      <label className="block mb-2 text-gray-500">
                        EIN Number
                      </label>

                      <input
                        required
                        onChange={this.onChange}
                        value={this.state.ein}
                        id="ein"
                        type="number"
                        style={{ borderColor: borderColor }}
                        className={classnames(
                          "w-full p-2 mb-6 text-gray-700 border-2  outline-none"
                        )}
                      />
                    </div>
                    <label className="block mb-2 text-gray-500">States</label>

                    <Select
                      isMulti
                      options={states}
                      onChange={handleSelectChange}
                      style={{ borderColor: borderColor }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          width: "50%",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem",
                          backgroundColor: "#00B050",
                        }}
                        type="submit"
                        className="w-full text-white font-bold py-2 px-4 rounded"
                      >
                        Click here to continue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

Company.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(Company);
