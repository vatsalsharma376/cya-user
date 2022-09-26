const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayrollSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // how we associate each Payroll with a user
    ref: "users",
  },
  payrollId: {
    type: String,
    required: true,
  },
  ein: {
    type: String,
    //required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  accountname: {
    type: String,
    required: true,
  },
});

module.exports = Payroll = mongoose.model("payrolls", PayrollSchema);
