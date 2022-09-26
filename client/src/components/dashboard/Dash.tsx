import React from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { useFinchConnect } from "react-finch-connect";
import {
  getTransactions,
  addAccount,
  getAccounts,
  deleteAccount,
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import bank from "../../img/bank.png";
import salary from "../../img/salary.png";
var adac: (arg0: { public_token: any; metadata: any }) => void;
var ac: any;
var veryUniqueId: React.SetStateAction<null> = null;
const Dash = (props: {
  addAccount?: any;
  accounts?: any;
  getAccounts?: any;
  deleteAccount?: any;
  plaid?: any;
  user?: any;
}) => {
  // Add account
  const [linkToken, setLinkToken] = useState(null);
  const [decoded, setdecoded] = useState(null);
  const [code, setCode] = useState(null);
  const [linkedPayroll, setLinkedPayroll] = useState<any[]>([]);
  const onSuccess = async ({ code }: any) => {
    setCode(code);
    console.log(code);
    const response = await axios.post("/api/plaid/fexchange", { code });
    // console.log(response);
    const responseCompany = await axios.post(
      "/api/plaid/fcompany",
      response.data
    );
    const legal_name = await responseCompany.data.legal_name;
    setLinkedPayroll([...linkedPayroll, responseCompany.data]);
    const addPayroll = await axios.post("/api/plaid/addPayroll", {
      ...responseCompany.data,
      accesstoken: response.data.access_token,
    });
    // console.log(responseCompany);
  };
  const onError = ({ errorMessage }: any) => console.error(errorMessage);
  const onClose = () => console.log("User exited Finch Connect");

  const { open } = useFinchConnect({
    clientId: "475f6b56-3165-4c02-a1fe-c8edf6cff57b",
    // payrollProvider: '<payroll-provider-id>',
    products: ["company", "directory"],
    onSuccess,
    onError,
    onClose,
  });
  const generateToken = async () => {
    const token = localStorage.jwtToken;

    var newToken = token.substring(7); // used to remove the Bearer string and space from the token so that
    //it consists of only header,payload and signature.
    veryUniqueId = parseJWT(newToken).id;
    console.log(veryUniqueId);
    setdecoded(veryUniqueId);
    const response = await axios.post("/api/plaid/create_link_token", {
      id: veryUniqueId,
    });
    const data = await response.data;

    setLinkToken(data.link_token);
    //console.log(linkToken);
  };
  const parseJWT = (tkn: string) => {
    var base64Url = tkn.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };
  const getPayrolls = async () => {
    const res = await axios.get("/api/plaid/getPayroll");
    const addedPayrolls = await res.data;
    console.log(addedPayrolls);
    setLinkedPayroll(addedPayrolls);
  };
  useEffect(() => {
    generateToken();

    props.getAccounts();
    getPayrolls();
  }, []);
  console.log(props);
  adac = props.addAccount;
  ac = props.plaid.accounts;
  //console.log(adac,ac);
  // props.getAccount() props
  // Delete account

  const onDeleteClick = (id: any) => {
    const { accounts } = props.plaid;
    const accountData = {
      id: id,
      accounts: accounts,
    };
    props.deleteAccount(accountData);
  };

  // Logout

  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance

  // const { open, exit, ready } = usePlaidLink(config);

  const { user } = props.plaid;
  //generateToken();
  const accounts = props.plaid.accounts;
  let accountItems =
    accounts === null || null
      ? ""
      : accounts.map(
          (account: {
            _id: React.Key | null | undefined;
            institutionName:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
          }) => (
            <li
              key={account._id}
              style={{ width: "100%" }}
              className="border-2 border-black p-4"
            >
              {/* <button
                style={{ marginRight: "1rem" }}
                onClick={onDeleteClick.bind(this, account._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                <i className="material-icons">delete</i>
              </button> */}
              {/* <p>
                <b className="text-xl">{account.institutionName}</b> delete
              </p> */}
              <div
                className="flex flex-row"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <img src={bank} alt="bank" className="w-10 h-10" />
                <p style={{ width: "80%" }}>{account.institutionName}</p>
                <p
                  className="text-blue-700"
                  onClick={onDeleteClick.bind(this, account._id)}
                  style={{ cursor: "pointer" }}
                >
                  delete
                </p>
              </div>
            </li>
          )
        );
  let payrollItems =
    linkedPayroll === null || null
      ? ""
      : linkedPayroll.map((payroll) => (
          <li
            key={payroll.id ? payroll.id : payroll.payrollId}
            style={{ width: "100%" }}
            className="border-2 border-black p-4"
          >
            <div
              className="flex flex-row"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <img src={salary} alt="bank" className="w-10 h-10" />
              <p style={{ width: "80%" }}>
                {payroll.legal_name ? payroll.legal_name : payroll.accountname}
              </p>
            </div>
          </li>
        ));
  return (
    <div
      className="mainc ml-10"
      style={{ justifyContent: "space-between", marginRight: "20%" }}
    >
      <div>
        <br />
        Fantastic!
        <br />
        <br />
        <div style={{ width: "50%", justifyContent: "center" }}>
          {accountItems.length > 0 ? (
            <div>
              You're all set!
              <br />
              <br />
              <p className="text-gray-500">
                Below are systems you mapped to ClaimYourAid.com:
              </p>
              <br />
              <ul style={{ width: "60%" }} className="text-s">
                {accountItems}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
        <br />
        <p className="text-gray-500">
          {accountItems.length == 0
            ? "Next, which bank does your business use?"
            : ""}
        </p>
        {linkToken !== null ? (
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            <Link {...props} linkToken={linkToken} />
          </button>
        ) : (
          <h3 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Loading..
          </h3>
        )}
        <br />
        <br />
        <p className="text-gray-500">
          {payrollItems.length == 0
            ? "Next, which payroll does your business use?"
            : ""}
        </p>
        <div style={{ width: "50%", justifyContent: "center" }}>
          {payrollItems.length > 0 ? (
            <div>
              <p className="text-gray-500">
                Below are payroll systems you mapped to ClaimYourAid.com:
              </p>
              <br />
              <ul style={{ width: "60%" }} className="text-s">
                {payrollItems}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-10"
          onClick={() => open()}
        >
          Connect Payroll
        </button>
      </div>
    </div>
  );
};

interface LinkProps {
  linkToken: string | null;
}
const Link: React.FC<LinkProps> = (props: LinkProps) => {
  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server
    //const { accounts } = props;
    const plaidData = {
      public_token: public_token,
      metadata: metadata,
      accounts: ac,
    };

    adac(plaidData); // props.addAccount(plaidData)
    console.log(public_token, metadata, props);

    // const response = fetch('api/plaid/accounts/add', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ public_token,metadata }),
    // });
    // Handle response ...
  }, []);
  const configg: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(configg);
  return (
    <>
      <button onClick={() => open()} disabled={!ready}>
        Link account
      </button>
    </>
  );
};
Dash.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  // accounts: PropTypes.array.isRequired,
  // plaid: PropTypes.object.isRequired,
  // user: PropTypes.object.isRequired
};

const mapStateToProps = (state: { plaid: any }) => ({
  plaid: state.plaid,
});

export default connect(mapStateToProps, {
  logoutUser,
  getTransactions,
  getAccounts,
  addAccount,
  deleteAccount,
})(Dash);
