import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {
  getTransactions,
  addAccount,
  deleteAccount,
} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import MaterialTable from "material-table"; // https://mbrn.github.io/material-table/#/
import cal from "../../img/cal.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const Template = (props) => {
  let transactionsData = [];
  const [len, setLen] = useState(0);
  const [showtxn, setshowtxn] = useState([{}]);
  const [txnloading, settxnloading] = useState(true);
  // const populate = () => {
  const [cal1, setcal1] = useState(false);
  const [cal2, setcal2] = useState(false);
  const [date1, setdate1] = useState("Choose a starting date");
  const [date2, setdate2] = useState("Choose an ending date");
  // }
  const { accounts } = props.plaid;
  console.log(accounts, 5435);
  useEffect(() => {
    (async () => {
      axios
        .post("/api/plaid/accounts/transactions", accounts)
        .then((response) => {
          const transactions = response.data; // txn = [[]]
          console.log(response);
          transactions.forEach(function (account) {
            account.transactions.forEach(function (transaction) {
              transactionsData.push({
                account: account.accountName,
                date: transaction.date,
                category: transaction.category[0],
                name: transaction.name,
                amount: transaction.amount,
              });
            });
          });
          //console.log(transactionsData);
          settxnloading(false);
          setLen(transactionsData.length);
          setshowtxn(transactionsData);
        });
      //transactionsData.forEach((ex)=>console.log(ex)); works
    })();
  }, []);

  // Setting up data table
  const transactionsColumns = [
    { title: "Account", field: "account" },
    { title: "Date", field: "date", type: "date", defaultSort: "desc" },
    { title: "Name", field: "name" },
    { title: "Amount", field: "amount", type: "numeric" },
    { title: "Category", field: "category" },
  ];
  //console.log(props.plaid);

  // transactionsData[0] -> object
  //console.log(props);
  return (
    <div className="ml-20">
      <br />
      <br />
      <br />
      <form style={{ width: "300px" }}>
        <label class="block text-gray-700 text-lg font-bold mb-2" for="from">
          Start
        </label>

        <div className="flex flex-row">
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="start"
            type="text"
            placeholder={date1}
            readOnly
          />
          <div>
            {" "}
            <img
              src={cal}
              alt="cal"
              width="45"
              height="45"
              style={{ cursor: "pointer" }}
              onClick={() => setcal1(!cal1)}
            />{" "}
          </div>
        </div>
        {cal1 && (
          <Calendar
            onClickDay={(newD) => {
              setcal1(!cal1);
              setdate1(newD.toString().substring(4, 15));
            }}
          />
        )}
        <label class="block text-gray-700 text-lg font-bold mb-2" for="end">
          End
        </label>
        <div className="flex flex-row">
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="end"
            type="text"
            placeholder={date2}
            readOnly
          />
          <div>
            {" "}
            <img
              src={cal}
              alt="cal"
              width="45"
              height="45"
              style={{ cursor: "pointer" }}
              onClick={() => setcal2(!cal2)}
            />{" "}
          </div>
        </div>
        {cal2 && (
          <Calendar
            onClickDay={(newD) => {
              setcal2(!cal2);
              setdate2(newD.toString().substring(4, 15));
            }}
          />
        )}
      </form>
      <h5>
        <b className="text-3xl text-indigo-800">Transactions</b>
      </h5>
      {accounts.length <= 0 ? (
        <p>You haven't added an account yet</p>
      ) : txnloading ? (
        <p className="text-xl text-gray-600">Fetching transactions...</p>
      ) : (
        <>
          <p className="text-xl smol">
            You have <b>{len}</b> transactions from your
            <b> {accounts.length}</b> linked
            {accounts.length > 1 ? (
              <span> accounts </span>
            ) : (
              <span> account </span>
            )}
            from the past 30 days
          </p>

          <MaterialTable
            columns={transactionsColumns}
            data={showtxn}
            title="Search Transactions"
          />
        </>
      )}
    </div>
  );
};

Template.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  plaid: state.plaid,
});

export default connect(mapStateToProps, {
  logoutUser,
  getTransactions,
  addAccount,
  deleteAccount,
})(Template);
