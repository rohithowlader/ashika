const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
  getDetails,
  upsertDetails,
} = require("../controllers/client.controller");

const router = express.Router();

router.use(protect);

router.get("/details", getDetails);

// Minimal validations; add more if you want
router.put(
  "/details",
  [
    body("fullName").optional().isString(),
    body("panNo").optional().isString(),
    body("nseCoRegDate").optional().isString(),
    body("bseRegDate").optional().isString(),
    body("nseCmRegDate").optional().isString(),
    body("nseFnoRegDate").optional().isString(),
    body("nseCfRegDate").optional().isString(),
    body("ncdexRegDate").optional().isString(),
    body("mseiRegDate").optional().isString(),
  ],
  upsertDetails
);

module.exports = router;
