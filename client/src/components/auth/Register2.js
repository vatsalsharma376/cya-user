import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import LogoHeader from "../layout/LogoHeader";
const borderColor = "#A2C987";
class Register2 extends Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      cell: "",
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.props, this.state);
    var fulluser = this.props.location.state;

    fulluser.fname = this.state.fname;
    fulluser.lname = this.state.lname;
    fulluser.cell = this.state.cell;

    this.props.history.push({
      pathname: "/company",
      state: fulluser,
    });
  };

  render() {
    return (
      <div className="container">
        <LogoHeader />
        <div className="ml-20">
          <p>Thank you for registering for ClaimYourAid.com!</p>

          <p className="mt-10 text-gray-500">
            Next, may we request your details
          </p>
        </div>
        <div className="container flex content-center ">
          <div
            style={{ borderColor: borderColor }}
            className="row max-w-xl w-full m-auto bg-white box-border border-4 rounded p-5"
          >
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <label htmlFor="fname" className="block mb-2 text-gray-500">
                  First Name
                </label>

                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  id="fname"
                  type="text"
                  className={classnames(
                    "w-full p-2 mb-6 text-green-700 border-2 outline-none"
                  )}
                />
              </div>
              <div className="input-field col s12">
                <label htmlFor="lname" className="block mb-2 text-gray-500">
                  Last Name
                </label>

                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  id="lname"
                  type="text"
                  className={classnames(
                    "w-full p-2 mb-6 text-green-700 border-2 outline-none"
                  )}
                />
              </div>
              <div className="input-field col s12">
                <label htmlFor="cell" className="block mb-2 text-gray-500">
                  Cell Phone number
                </label>

                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  id="cell"
                  type="text"
                  className={classnames(
                    "w-full p-2 mb-6 text-green-700 border-2 outline-none"
                  )}
                />
              </div>

              <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                <button
                  style={{
                    width: "250px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    backgroundColor: "#00B050",
                  }}
                  type="submit"
                  className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
                >
                  <center>Click Here To Continue</center>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register2.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(
  withRouter(Register2)
);
