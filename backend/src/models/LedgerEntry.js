const mongoose = require("mongoose");

const ledgerEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    document: { type: String, required: true, unique: true },
    particular: { type: String, required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    balance: { type: Number, default: 0 }, // running balance AFTER this row
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// IMPORTANT for “later rows” queries:
ledgerEntrySchema.index({ createdAt: 1 });

module.exports = mongoose.model("LedgerEntry", ledgerEntrySchema);
