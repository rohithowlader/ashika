import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function RevenueLedgerCreate() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    particular: "",
    debit: "",
    credit: "",
  });

  const balance = useMemo(
    () => Number(form.debit || 0) - Number(form.credit || 0),
    [form.debit, form.credit]
  );

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/ledger", {
      date: form.date,
      particular: form.particular,
      debit: Number(form.debit || 0),
      credit: Number(form.credit || 0),
    });
    alert("Entry added!");
    nav("/revenue");
  };

  return (
    <div className="ledger">
      {/* Scoped styles just for this page */}
      <style>{`
        .ledger .create-card {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 20px;
          border-radius: 0;
          box-shadow: none;
        }
        @media (max-width: 768px) {
          .ledger .create-card .form {
            grid-template-columns: 1fr; /* stack on small screens */
          }
        }
      `}</style>

      <div className="layout">
        <Sidebar open={open} setOpen={setOpen} />
        <div>
          <Topbar onMenu={() => setOpen(true)} />
          <main className="page">
            <div className="page-head">
              <h3 style={{ margin: 0 }}>Add Ledger Entry</h3>
              <div className="actions">
                <Link to="/revenue" className="btn">
                  Back to List
                </Link>
              </div>
            </div>

            <div className="card create-card">
              <form className="form" onSubmit={submit}>
                <div className="input">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input" style={{ gridColumn: "span 2" }}>
                  <label>Particular</label>
                  <input
                    name="particular"
                    placeholder="Enter particulars..."
                    value={form.particular}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input">
                  <label>Debit</label>
                  <input
                    type="number"
                    step="0.01"
                    name="debit"
                    value={form.debit}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <label>Credit</label>
                  <input
                    type="number"
                    step="0.01"
                    name="credit"
                    value={form.credit}
                    onChange={handleChange}
                  />
                </div>
                <div className="input">
                  <label>Auto Balance</label>
                  <input value={balance.toFixed(2)} readOnly />
                </div>
                <div className="input">
                  <label>Document</label>
                  <input
                    value="Will be auto-generated (e.g., SBI CB 00001)"
                    readOnly
                  />
                </div>
                <button className="btn primary" type="submit">
                  Save Entry
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
