import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import axios from "axios";
import LogoHeader from "../layout/LogoHeader";
const borderColor = "#A2C987";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
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
    //console.log(this.state.email,this.state.password);
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    // fetch('/api/plaid/getemail',{
    //   method: 'POST',
    //   body: JSON.stringify({email:userData.email})
    // }).then();

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <>
        <LogoHeader />

        <div className="py-1 ml-20">
          Sign In
          <br />
          <br />
          <label className="text-gray-500">
            Access your ClaimYourAid.com profile:
          </label>
        </div>
        <div className="container flex content-center ">
          <div
            style={{ marginTop: "1rem", borderColor: "#A2C987" }}
            className="max-w-xl w-full m-auto bg-white box-border border-4 rounded p-5"
          >
            <div className="col s8 offset-s2">
              <br />
              <form onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                  <label className="block mb-2 text-gray-500">Email</label>

                  <input
                    required
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    style={{ borderColor: borderColor }}
                    className={classnames(
                      "w-full p-2 mb-6 text-green-700 border-2 outline-none",
                      {
                        invalid: errors.email || errors.emailnotfound,
                      }
                    )}
                  />
                  <span className="red-text">
                    {errors.email}
                    {errors.emailnotfound}
                  </span>
                </div>
                <div className="input-field col s12">
                  <label className="block mb-2 text-gray-500">Password</label>

                  <input
                    required
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    style={{ borderColor: borderColor }}
                    className={classnames(
                      "w-full p-2 mb-6 text-green-700 border-2 outline-none",
                      {
                        invalid: errors.password || errors.passwordincorrect,
                      }
                    )}
                  />
                  <span className="red-text">
                    {errors.password}
                    {errors.passwordincorrect}
                  </span>
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
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem",
                      backgroundColor: "#00B050",
                    }}
                    type="submit"
                    className="w-full hover:bg-pink-700 text-white font-bold py-2 px-4 mb-4 rounded"
                  >
                    <center>Sign in</center>
                  </button>
                </div>
                <p className="grey-text text-darken-1 text-center">
                  New to ClaimYourAid?{" "}
                  <Link
                    to="/register"
                    className="text-green-700 hover:text-pink-700 text-lg"
                  >
                    Join Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
