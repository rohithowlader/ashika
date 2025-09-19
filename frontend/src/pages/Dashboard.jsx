import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/ledger.css"; // reuse sidebar/topbar/layout
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#a855f7"];

const portfolioData = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 120000 },
  { month: "Mar", value: 150000 },
  { month: "Apr", value: 200000 },
  { month: "May", value: 180000 },
  { month: "Jun", value: 220000 },
  { month: "Jul", value: 250000 },
  { month: "Aug", value: 300000 },
  { month: "Sep", value: 280000 },
  { month: "Oct", value: 320000 },
  { month: "Nov", value: 350000 },
  { month: "Dec", value: 400000 },
];

const pieData = [
  { name: "Mutual Fund", value: 50 },
  { name: "Systematic Investment Plan", value: 50 },
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="ledger">
      <style>{`
        .dash-grid{ display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-top:20px; }
        .card-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-top:16px; }
        .card-box{ background:#fff; border:1px solid #e7ebf3; border-radius:16px; padding:16px; box-shadow:0 6px 20px rgba(2,6,23,.05); }
        .big-card{ grid-column:span 2; }
        .card-title{ font-weight:700; color:#475569; margin-bottom:8px; }
        .card-value{ font-size:20px; font-weight:800; color:#111827; }
        .small{ font-size:14px; color:#64748b; }
        .section-head{ font-weight:800; margin:20px 0 8px; color:#334155; }
        @media(max-width:1024px){ .dash-grid{ grid-template-columns:1fr } .big-card{ grid-column:span 1; } }
      `}</style>

      <div className="layout">
        <Sidebar open={open} setOpen={setOpen} />
        <div>
          <Topbar onMenu={() => setOpen(true)} />

          <main className="page">
            {/* Dashboard Overview */}
            <h3 className="section-head">Dashboard Overview</h3>
            <div className="card-grid">
              <div className="card-box big-card">
                <div className="card-title">Account</div>
                <div className="card-value">₹ 10,00,00,000 Cr</div>
                <div className="small">Total Revenue</div>
              </div>
              <div className="card-box">
                <div className="card-title">Including brokerage fees</div>
                <div className="card-value">₹ 50,000,00</div>
              </div>
              <div className="card-box">
                <div className="card-title">Commissions</div>
                <div className="card-value">₹ 50,000,00</div>
              </div>
              <div className="card-box">
                <div className="card-title">Other sources</div>
                <div className="card-value">₹ 50,000,00</div>
              </div>
            </div>

            <div className="dash-grid">
              {/* Portfolio Value */}
              <div className="card-box">
                <div className="card-title">Portfolio Value</div>
                <div className="card-value">₹10,00,000</div>
                <div className="small">
                  Your Profit is{" "}
                  <span style={{ color: "#4f46e5" }}>₹10,000</span>
                </div>
                <div style={{ height: 250, marginTop: 10 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData}>
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4f46e5"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4f46e5"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4f46e5"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Client Activity + Pie */}
              <div className="card-box">
                <div className="card-title">Client Activity</div>
                <div className="card-grid" style={{ marginTop: 0 }}>
                  <div className="card-box" style={{ padding: 10 }}>
                    <div className="small">Total client active</div>
                    <div className="card-value">1.5 Lakh</div>
                  </div>
                  <div className="card-box" style={{ padding: 10 }}>
                    <div className="small">Dormant Clients</div>
                    <div className="card-value">50k</div>
                  </div>
                </div>
                <div style={{ height: 220, marginTop: 10 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
