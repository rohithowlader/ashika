const { validationResult } = require("express-validator");
const Counter = require("../models/Counter");
const LedgerEntry = require("../models/LedgerEntry");

const DOC_PREFIX = "SBI CB";

async function getNextDoc() {
  const r = await Counter.findOneAndUpdate(
    { key: "ledger_document" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  const padded = String(r.seq).padStart(5, "0");
  return `${DOC_PREFIX} ${padded}`;
}

// helper: get last balance (latest created row)
async function getLastBalance() {
  const last = await LedgerEntry.findOne().sort({ createdAt: -1 }).lean();
  return last ? Number(last.balance || 0) : 0;
}

// POST /api/ledger  — append-only create; running balance = last + delta
async function createEntry(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ msg: errors.array()[0].msg });

  const { date, particular, debit = 0, credit = 0 } = req.body;

  const document = await getNextDoc();
  const delta = Number(debit || 0) - Number(credit || 0);
  const lastBal = await getLastBalance();
  const balance = lastBal + delta;

  const entry = await LedgerEntry.create({
    date,
    document,
    particular,
    debit,
    credit,
    balance,
    createdBy: req.userId,
  });

  res.status(201).json(entry);
}

// GET /api/ledger?page=&limit=&q=&by=
async function listEntries(req, res) {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.max(parseInt(req.query.limit || "10"), 1);
  const q = (req.query.q || "").trim();
  const by = req.query.by || "all";

  let filter = {};
  if (q) {
    const rx = new RegExp(q, "i");
    if (by === "document") filter.document = rx;
    else if (by === "particular") filter.particular = rx;
    else filter = { $or: [{ document: rx }, { particular: rx }] };
  }

  const [items, total] = await Promise.all([
    LedgerEntry.find(filter)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    LedgerEntry.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

// PUT /api/ledger/:id — update row and shift later rows by diff
async function updateEntry(req, res) {
  const { id } = req.params;
  const patch = req.body;

  const current = await LedgerEntry.findById(id);
  if (!current) return res.status(404).json({ msg: "Not found" });

  // old vs new deltas
  const oldDelta = Number(current.debit || 0) - Number(current.credit || 0);
  const newDebit =
    patch.debit !== undefined
      ? Number(patch.debit)
      : Number(current.debit || 0);
  const newCredit =
    patch.credit !== undefined
      ? Number(patch.credit)
      : Number(current.credit || 0);
  const newDelta = newDebit - newCredit;
  const diff = newDelta - oldDelta;

  // update this row first
  if (patch.date !== undefined) current.date = patch.date;
  if (patch.particular !== undefined) current.particular = patch.particular;
  current.debit = newDebit;
  current.credit = newCredit;
  current.balance = Number(current.balance || 0) + diff;
  await current.save();

  // shift all later rows (created after this one)
  if (diff !== 0) {
    await LedgerEntry.updateMany(
      { createdAt: { $gt: current.createdAt } },
      { $inc: { balance: diff } }
    );
  }

  res.json(current);
}

// DELETE /api/ledger/:id — remove row and shift later rows back by its delta
async function removeEntry(req, res) {
  const { id } = req.params;

  const current = await LedgerEntry.findById(id);
  if (!current) return res.status(404).json({ msg: "Not found" });

  const delta = Number(current.debit || 0) - Number(current.credit || 0);

  await current.deleteOne();

  // decrease all later rows by this row's delta
  if (delta !== 0) {
    await LedgerEntry.updateMany(
      { createdAt: { $gt: current.createdAt } },
      { $inc: { balance: -delta } }
    );
  }

  res.json({ ok: true });
}

module.exports = { createEntry, listEntries, updateEntry, removeEntry };
