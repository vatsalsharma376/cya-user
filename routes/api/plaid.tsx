const express = require("express");
const plaid = require("plaid");
//app.use(express.json());
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const http = require("http");
const MongoClient = require("mongodb").MongoClient;
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
// import fetch from "node-fetch";
// Load Account and User models
const axios = require("axios");
const Account = require("../../models/Account");
const User = require("../../models/User");
const Company = require("../../models/Company");
const Transaction = require("../../models/Transaction");
const Payroll = require("../../models/Payroll");
var CompanyId;
const configuration = new Configuration({
  basePath: PlaidEnvironments["sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.CLIENTID,
      "PLAID-SECRET": process.env.SECRET,
    },
  },
});
const userURI =
  "mongodb+srv://claimyouraid:cya@cluster0.kfgzq.mongodb.net/?retryWrites=true&w=majority";
const connectToCluster = async (uri) => {
  try {
    let mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    return mongoClient;
  } catch (err) {
    console.error("Connection to MongoDB Atlas failed!", err);
  }
};

const client = new PlaidApi(configuration);
var uniq;
router.post("/getid", (req, res) => {
  try {
    console.log("this is getid", req.body);
    uniq = req.body.id;
  } catch (err) {
    console.log("this is the getid error", err.data);
  }
});
router.post("/create_link_token", async function (request, response) {
  // Get the client_user_id by searching for the current user
  // const user = await User.find(...); mongodb field _id unique
  //const clientUserId = user.id; logged in user k liye key  db email pwd + id
  console.log("token decoded from createlinktoken", request.body);

  const request1 = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: request.body.id,
    },
    client_name: "ClaimYourAid",
    products: ["auth", "transactions"],
    language: "en",
    country_codes: ["us"],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request1);
    await response.json(createTokenResponse.data);
  } catch (error) {
    // handle error
    console.log("This is a plaid link button error", error);
  }
});

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

// @route GET api/plaid/accounts
// @desc Get all accounts linked with plaid for a specific user
// @access Private
router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.find({ userId: req.user.id })
      .then((accounts) => res.json(accounts))
      .catch((err) => console.log(err));
  }
);

// @route POST api/plaid/accounts/add
// @desc Trades public token for access token and stores credentials in database
// @access Private
router.post(
  "/accounts/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    PUBLIC_TOKEN = req.body.public_token;
    console.log(req.body);
    const userId = req.user.id;
    const institution = req.body.metadata.institution;
    const comId = req.body.companyId;
    const { name, institution_id } = institution;

    const publicToken = req.body.public_token;
    try {
      const request = {
        public_token: publicToken,
      };
      const response = await client.itemPublicTokenExchange(request);
      ACCESS_TOKEN = await response.data.access_token;
      ITEM_ID = await response.data.item_id;
      const mongoClient = await connectToCluster(userURI);
      const db1 = await mongoClient.db("Cluster0");
      const txncoll = await db1.collection("transactions");
      await console.log(response.data);
      const mungu = async () => {
        if (PUBLIC_TOKEN) {
          Account.findOne({
            userId: req.user.id,
            institutionId: institution_id,
          })
            .then((account) => {
              if (account) {
                console.log("Account already exists");
              } else {
                const newAccount = new Account({
                  companyId: comId,
                  userId: userId,
                  accessToken: ACCESS_TOKEN,
                  itemId: ITEM_ID,
                  institutionId: institution_id,
                  institutionName: name,
                });

                newAccount.save().then((account) => {
                  res.json(account);
                  const now = moment();
                  const today = now.format("YYYY-MM-DD");
                  const twoYearsAgo = now
                    .subtract(2, "years")
                    .format("YYYY-MM-DD");
                  const txnreq = {
                    access_token: response.data.access_token,
                    start_date: twoYearsAgo,
                    end_date: today,
                    options: {
                      count: 500,
                    },
                  };
                  //let transactions = [];
                  var alltxn = [];
                  client.transactionsGet(txnreq).then((response) => {
                    //console.log(response); response.data.transactions = an array of transaction objects
                    let transaction1 = response.data.transactions;
                    for (var i = 0; i < transaction1.length; i++) {
                      alltxn.push({
                        userId: userId,
                        accountId: newAccount._id,
                        accessToken: newAccount.accessToken,
                        accountname: name,
                        name: transaction1[i].name,
                        amount: transaction1[i].amount,
                        txndate: transaction1[i].date,
                        category: transaction1[i].category[0],
                      });
                    }
                  });
                });
              }
            })
            .catch((err) => {
              console.log("wow", err);
            }); // Mongo Error
        }
      };
      await mungu();

      // adding transactions to newly created accounts
    } catch (error) {
      // handle error
      console.log("acces token exchange erro");
    }
  }
);

// @route DELETE api/plaid/accounts/:id
// @desc Delete account with given id
// @access Private
router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findById(req.params.id).then((account) => {
      // Delete account
      account.remove().then(() => res.json({ success: true }));
    });
  }
);

// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions from past 30 days from all linked accounts
// @access Private
router.post(
  "/accounts/transactions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

    let transactions = [];

    const accounts = req.body;
    //console.log(accounts);
    if (accounts) {
      accounts.forEach(function (account) {
        ACCESS_TOKEN = account.accessToken;
        const institutionName = account.institutionName;
        const txnreq = {
          access_token: ACCESS_TOKEN,
          start_date: thirtyDaysAgo,
          end_date: today,
        };
        client
          .transactionsGet(txnreq)
          .then((response) => {
            //console.log(response);
            transactions.push({
              accountName: institutionName,
              transactions: response.data.transactions,
            });

            if (transactions.length === accounts.length) {
              res.json(transactions);
            }
          })
          .catch((err) => console.log(err));
      });
    }
  }
);

router.post("/CreateCompany", (req, res) => {
  const newcompany = new Company({
    name: req.body.name,
    ein: req.body.ein,
    states: req.body.states,
  });

  newcompany.save().then((company) => {
    CompanyId = company.name;
    res.json(company);
  });
});

router.post(
  "/addPayroll",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    const newPayroll = new Payroll({
      userId: req.user.id,
      payrollId: req.body.id,
      ein: req.body.ein,
      accessToken: req.body.accesstoken,
      accountname: req.body.legal_name,
    });
    newPayroll.save().then((payroll) => {
      return res.status(200).json(payroll);
    }).catch((err)=>{
      return res.status(400).json(err);
    })
    
  }
);
router.get(
  "/getPayroll",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    // return all payroll documents which has userId = req.user.id
    const payrolls = await Payroll.find({ userId: req.user.id });
    return res.status(200).json(payrolls);
    
  }
);
var faccessToken;
router.post("/fcompany", async function (req, res) {
  //console.log(req.body);
  const fcompanyRequest = {
    url: "https://api.tryfinch.com/employer/company",
    method: "GET",
    headers: {
      "Finch-API-Version": "2020-09-17",
      Authorization: "Bearer " + req.body.access_token,
    },
  };
  const companyRes = await axios(fcompanyRequest);
  console.log(companyRes.data);
  return res.status(200).json(companyRes.data);
});

router.post(
  "/fexchange",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    //console.log(req.user);
    // console.log(req);
    const code = req.body.code;
    const exchangeRequest = {
      url: "https://api.tryfinch.com/auth/token",
      method: "POST",
      // auth: {
      //   user: "6b15880b-afa3-4c23-a361-afccbc68c23b",
      //   pass: "finch-secret-sandbox-vJ6JdAIjvBU6z-DViCiBcZkVZ99x-yrBQ7oOXt4R",
      // },
      data: {
        code,
        redirect_uri: "https://tryfinch.com",
        client_id: process.env.FCLIENTID,
        client_secret:
          process.env.FSECRET,
      },
    };
    // const authRes = await request({
    //   uri: "https://api.tryfinch.com/auth/token",
    //   auth: {
    //     user: process.env.FCLIENT_ID,
    //     pass: process.env.FCLIENT_SECRET,
    //   },
    //   method: "POST",
    //   body: { code, redirect_uri: 'https://tryfinch.com' },
    //   json: true,
    // });

    const resp = await axios(exchangeRequest);
    faccessToken = await resp.data.access_token;
    //console.log('xxx',faccessToken);
    return res.status(200).json(resp.data);
  }
);

module.exports = router;
