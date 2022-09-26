import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import LogoHeader from "../layout/LogoHeader";
const borderColor = "#A2C987";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dash");
    }
  }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.history.nusr = newUser;
    // console.log(this.props.history.nusr);
    // history.push is used to redirect to another page but empty current
    this.props.history.push({
      pathname: "/register2",
      state: newUser,
    });
  };

  render() {
    const { errors } = this.state;

    return (
      <>
        <LogoHeader />
        <div className="container">
          <div className="intro ml-20">
            <p>
              Are you ready to find out which grants, credits, and refunds, your
              business qualifies for?
            </p>
            <br />
            <p className="text-gray-500">Register for ClaimYourAid.com now:</p>
            <br />
          </div>
          <div className="container flex content-center ">
            <div
              style={{ borderColor: borderColor }}
              className="row max-w-xl w-full m-auto bg-white box-border border-4 rounded p-5"
            >
              <div className="col s8 offset-s2">
                <form noValidate onSubmit={this.onSubmit}>
                  <div className="input-field col s12">
                    <label htmlFor="email" className="block mb-2 text-gray-500">
                      Email
                    </label>

                    <input
                      onChange={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      id="email"
                      type="email"
                      className={classnames(
                        "w-full p-2 mb-6 text-green-700 border-2 outline-none",
                        {
                          invalid: errors.email,
                        }
                      )}
                    />
                    <span className="text-red-600">{errors.email}</span>
                  </div>
                  <div className="input-field col s12">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-gray-500"
                    >
                      {"Password (6 or more letters & numbers)"}
                    </label>

                    <input
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      id="password"
                      type="password"
                      className={classnames(
                        "w-full p-2 mb-6 text-green-700 border-2 outline-none",
                        {
                          invalid: errors.password,
                        }
                      )}
                    />
                    <span className="text-red-600">{errors.password}</span>
                  </div>

                  <div className="col" style={{ paddingLeft: "11.250px" }}>
                    <p
                      className="text-xs text-center"
                      style={{ width: "100%" }}
                    >
                      {
                        "By clicking Agree & Join, you agree to the ClaimYourAid User "
                      }
                    </p>
                    <p
                      className="text-xs text-center"
                      style={{ width: "100%" }}
                    >
                      {" Agreement, Privacy Policy, and Cookie Policy."}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          width: "150px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          marginTop: "1rem",
                          backgroundColor: "#00B050",
                        }}
                        type="submit"
                        className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
                      >
                        Agree {"&"} Join
                      </button>
                    </div>
                  </div>
                  {/* <p className="grey-text text-darken-1">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-700 hover:text-pink-700 text-lg"
                  >
                    Log in
                  </Link>
                </p> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
