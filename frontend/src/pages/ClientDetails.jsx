import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/ledger.css"; // ✅ reuse sidebar/topbar/layout styles

const BLANK = {
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

export default function ClientDetails() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // load details
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/client/details");
        if (!alive) return;
        setForm({ ...BLANK, ...data });
      } catch {
        setForm(BLANK);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg("");
      await API.put("/client/details", form);
      setMsg("Saved successfully.");
    } catch (e2) {
      setMsg(e2?.response?.data?.msg || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2500);
    }
  };

  const chips = useMemo(
    () => [{ label: "Full Name", value: form.fullName || "—" }],
    [form]
  );

  const left = [
    { label: "Applicant Name", name: "fullName" },
    { label: "Trade Name", name: "tradeName" },
    { label: "PAN No", name: "panNo" },
    {
      label: "Constitution",
      name: "constitution",
      type: "select",
      options: ["", "individual", "partnership", "company", "huf", "others"],
    },
    { label: "RM Name", name: "rmName" },
    { label: "NSE Segment", name: "nseSegment" },
    { label: "NSE CO Reg- No", name: "nseCoRegNo" },
    { label: "NSE CO Reg- Date", name: "nseCoRegDate", type: "date" },
    { label: "BSE Segments", name: "bseSegments" },
    { label: "BSE Reg- No", name: "bseRegNo" },
    { label: "BSE Reg- Date", name: "bseRegDate", type: "date" },
  ];
  const right = [
    { label: "NSE CM Reg- No", name: "nseCmRegNo" },
    { label: "NSE CM Reg- Date", name: "nseCmRegDate", type: "date" },
    { label: "NSE FNO Reg- No", name: "nseFnoRegNo" },
    { label: "NSE FNO Reg- Date", name: "nseFnoRegDate", type: "date" },
    { label: "NSE CF Reg- No", name: "nseCfRegNo" },
    { label: "NSE CF Reg- Date", name: "nseCfRegDate", type: "date" },
    { label: "NCDEX Reg- No", name: "ncdexRegNo" },
    { label: "NCDEX Reg- Date", name: "ncdexRegDate", type: "date" },
    { label: "MSEI Reg- No", name: "mseiRegNo" },
    { label: "MSEI Segment", name: "mseiSegment" },
    { label: "MSEI Reg- Date", name: "mseiRegDate", type: "date" },
  ];

  return (
    <div className="ledger">
      {/* Page-specific overrides */}
      <style>{`
        .details-panel,
        .reg-card {
          width: 100%;
          max-width: none;
          margin: 0;
          border-radius: 0;
        }
        .chips{ display:flex; flex-wrap:wrap; gap:10px; }
        .chip{ display:inline-flex; align-items:center; gap:8px; background:#fff; border:1px solid #e7ebf3; padding:10px 12px; border-radius:999px; font-weight:600; color:#334155; box-shadow:0 6px 20px rgba(2,6,23,.05); }
        .chip .value{ font-weight:700; color:#111827; }

        .reg-head{ border-bottom:1px solid #eef2ff; padding:20px; text-align:center; font-weight:800; color:#475569; }
        .reg-body{ padding:20px; }

        .grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:18px 24px; }
        .row{ display:grid; grid-template-columns:220px 1fr; align-items:center; gap:12px; }
        .row label{ color:#64748b; font-weight:700; }
        .row input,.row select{ height:40px; border:1px solid #e7ebf3; border-radius:10px; padding:0 10px; width:100%; background:#fff; }

        @media (max-width:900px){ .grid-2{ grid-template-columns:1fr } }
        @media (max-width:640px){ .row{ grid-template-columns:1fr } }
      `}</style>

      <div className="layout">
        <Sidebar open={open} setOpen={setOpen} />
        <div>
          <Topbar onMenu={() => setOpen(true)} />
          <main className="page">
            {/* Information */}
            <section className="card details-panel">
              <h3 style={{ margin: "0 0 12px", color: "#334155" }}>
                Information
              </h3>
              <div className="chips">
                {chips.map((c, i) => (
                  <div key={i} className="chip">
                    <span>{c.label}</span>
                    <span className="value">{c.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Registration details */}
            <section className="card reg-card">
              <div className="reg-head">Registration Details</div>
              <form className="reg-body" onSubmit={submit}>
                {loading ? (
                  <div style={{ padding: 10, color: "#6b7280" }}>Loading…</div>
                ) : (
                  <div className="grid-2">
                    <div>
                      {left.map((f) => (
                        <div key={f.name} className="row">
                          <label>{f.label}</label>
                          {f.type === "select" ? (
                            <select
                              name={f.name}
                              value={form[f.name]}
                              onChange={handle}
                            >
                              {f.options.map((o) => (
                                <option key={o} value={o}>
                                  {o === "" ? "Select" : o}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              name={f.name}
                              type={f.type || "text"}
                              value={form[f.name] ?? ""}
                              onChange={handle}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      {right.map((f) => (
                        <div key={f.name} className="row">
                          <label>{f.label}</label>
                          <input
                            name={f.name}
                            type={f.type || "text"}
                            value={form[f.name] ?? ""}
                            onChange={handle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="actions"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    paddingTop: 16,
                  }}
                >
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save (Upsert)"}
                  </button>
                </div>

                {msg && (
                  <div style={{ marginTop: 8, color: "#334155" }}>{msg}</div>
                )}
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
