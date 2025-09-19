import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const PAGE_SIZE = 10;

export default function RevenueLedgerList() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [by, setBy] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lastReq = useRef({ page: 1, q: "", by: "all" });
  const pages = useMemo(
    () => Math.max(Math.ceil(total / PAGE_SIZE), 1),
    [total]
  );

  const searchTimer = useRef(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      go(1);
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [q, by]);

  useEffect(() => {
    go(1);
  }, []);

  const load = async (p, query, field) => {
    setLoading(true);
    setError("");
    const params = { page: p, limit: PAGE_SIZE, q: query, by: field };
    lastReq.current = params;
    try {
      const res = await API.get("/ledger", { params });
      const same =
        lastReq.current.page === params.page &&
        lastReq.current.q === params.q &&
        lastReq.current.by === params.by;
      if (same) {
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
      }
    } catch (e) {
      setError(e?.response?.data?.msg || e.message);
    } finally {
      setLoading(false);
    }
  };

  const go = (p) => {
    if (p < 1 || p > pages) return;
    load(p, q.trim(), by);
  };

  return (
    <div className="ledger">
      <div className="layout">
        <style>{`
        /* make ledger card stretch full width */
        .ledger-card {
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 0;
          border-radius: 0;
          box-shadow: none;
        }
        .ledger-card .search-row {
          padding: 1rem;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ledger-card table {
          width: 100%;
          border-collapse: collapse;
        }
        .ledger-card table thead th {
          position: static !important;
        }
        .ledger-card .pager {
          padding: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 6px;
        }
      `}</style>

        <Sidebar open={open} setOpen={setOpen} />
        <div>
          <Topbar onMenu={() => setOpen(true)} />
          <main className="page" style={{ paddingRight: 0 }}>
            <div className="page-head">
              <div className="tabs">
                <div className="tab">Mutual Fund</div>
                <div className="tab" style={{ opacity: 0.5 }}>
                  Broking
                </div>
              </div>
              <div className="actions">
                <Link className="btn primary" to="/revenue/new">
                  + Add Entry
                </Link>
              </div>
            </div>

            <div className="card ledger-card">
              {/* search row */}
              <div className="search-row">
                <input
                  className="search"
                  placeholder="Search by document or particular..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  style={{ flex: "1 1 300px" }}
                />
                <select
                  value={by}
                  onChange={(e) => setBy(e.target.value)}
                  className="input"
                >
                  <option value="all">All fields</option>
                  <option value="document">Document</option>
                  <option value="particular">Particular</option>
                </select>
                <div className="badge">Commission Ledger ▾</div>
              </div>

              {error && (
                <div className="error" style={{ margin: "0 1rem 1rem" }}>
                  {error}
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Date</th>
                      <th>Document</th>
                      <th>Particular</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      items.map((r, idx) => (
                        <tr key={r._id}>
                          <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td>{new Date(r.date).toLocaleDateString()}</td>
                          <td>{r.document}</td>
                          <td>{r.particular}</td>
                          <td>
                            {Number(r.debit || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            {Number(r.credit || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            {Number(r.balance || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    {loading && (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ padding: 20, color: "#6b7280" }}
                        >
                          Loading…
                        </td>
                      </tr>
                    )}
                    {!loading && items.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            padding: 20,
                            color: "#6b7280",
                            textAlign: "center",
                          }}
                        >
                          No records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pager">
                <button
                  className="pg"
                  onClick={() => go(page - 1)}
                  disabled={page === 1}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={`pg ${page === p ? "active" : ""}`}
                      onClick={() => go(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <span style={{ color: "#64748b", padding: "0 6px" }}>
                  of {pages}
                </span>
                <button
                  className="pg"
                  onClick={() => go(page + 1)}
                  disabled={page === pages}
                >
                  ›
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
