const { validationResult } = require("express-validator");
const ClientDetails = require("../models/ClientDetails");

// GET /api/client/details
// Returns the current user's details, or a blank template if not set
async function getDetails(req, res) {
  let doc = await ClientDetails.findOne({ user: req.userId }).lean();

  if (!doc) {
    // return a blank "template" with empty strings
    doc = {
      user: req.userId,
      fullName: "",
      backOfficeId: "",
      terminalId: "",
      branchCode: "",
      tradeName: "",
      panNo: "",
      constitution: "",
      rmName: "",
      nseSegment: "",
      nseCoRegNo: "",
      nseCoRegDate: "",
      bseSegments: "",
      bseRegNo: "",
      bseRegDate: "",
      nseCmRegNo: "",
      nseCmRegDate: "",
      nseFnoRegNo: "",
      nseFnoRegDate: "",
      nseCfRegNo: "",
      nseCfRegDate: "",
      ncdexRegNo: "",
      ncdexRegDate: "",
      mseiRegNo: "",
      mseiSegment: "",
      mseiRegDate: "",
    };
  }

  res.json(doc);
}

// PUT /api/client/details
// Upsert current user's details (create if not exists)
async function upsertDetails(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const payload = { ...req.body, user: req.userId };

  const updated = await ClientDetails.findOneAndUpdate(
    { user: req.userId },
    { $set: payload },
    { new: true, upsert: true }
  );

  res.json(updated);
}

module.exports = { getDetails, upsertDetails };
