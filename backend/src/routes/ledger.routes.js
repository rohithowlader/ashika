const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
  createEntry,
  listEntries,
  updateEntry,
  removeEntry,
} = require("../controllers/ledger.controller");
const router = express.Router();

router.use(protect);
router.get("/", listEntries);
router.post(
  "/",
  [body("date").isISO8601(), body("particular").isLength({ min: 2 })],
  createEntry
);
router.put(
  "/:id",
  [
    body("date").optional().isISO8601(),
    body("particular").optional().isLength({ min: 2 }),
  ],
  updateEntry
);
router.delete("/:id", removeEntry);

module.exports = router;
