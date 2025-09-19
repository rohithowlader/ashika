const mongoose = require("mongoose");

const clientDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },

    // Information chips
    fullName: String,
    backOfficeId: String,
    terminalId: String,
    branchCode: String,

    // Registration block (left)
    tradeName: String,
    panNo: String,
    constitution: String,
    rmName: String,
    nseSegment: String,
    nseCoRegNo: String,
    nseCoRegDate: String, // store as string or ISO date; keeping as string to match form
    bseSegments: String,
    bseRegNo: String,
    bseRegDate: String,

    // Registration block (right)
    nseCmRegNo: String,
    nseCmRegDate: String,
    nseFnoRegNo: String,
    nseFnoRegDate: String,
    nseCfRegNo: String,
    nseCfRegDate: String,
    ncdexRegNo: String,
    ncdexRegDate: String,
    mseiRegNo: String,
    mseiSegment: String,
    mseiRegDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientDetails", clientDetailsSchema);
