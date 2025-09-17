import React from "react";

/* Simple inline SVG so you don't need external assets.
   Replace with your own image if you like. */
export default function AuthIllustration({
  headline = "One Click To go All Digital",
}) {
  return (
    <section className="auth-hero">
      <h1 className="headline">{headline}</h1>
      <div className="panel">
        <svg
          viewBox="0 0 600 360"
          width="100%"
          height="100%"
          role="img"
          aria-label="Illustration"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="600" height="360" rx="18" fill="#293e6eff" />
          <g opacity="0.9">
            <circle cx="470" cy="95" r="55" fill="url(#g1)" opacity="0.15" />
            <rect
              x="360"
              y="140"
              width="180"
              height="120"
              rx="14"
              fill="#e0e7ff"
            />
            <rect
              x="380"
              y="160"
              width="140"
              height="14"
              rx="7"
              fill="#c7d2fe"
            />
            <rect
              x="380"
              y="184"
              width="100"
              height="10"
              rx="5"
              fill="#dbeafe"
            />
            <rect
              x="380"
              y="206"
              width="120"
              height="10"
              rx="5"
              fill="#dbeafe"
            />
          </g>
          <g>
            <rect
              x="70"
              y="90"
              width="210"
              height="160"
              rx="14"
              fill="#e2e8f0"
            />
            <circle cx="110" cy="150" r="22" fill="#94a3b8" />
            <rect
              x="140"
              y="140"
              width="120"
              height="12"
              rx="6"
              fill="#cbd5e1"
            />
            <rect
              x="140"
              y="160"
              width="150"
              height="10"
              rx="5"
              fill="#e5e7eb"
            />
            <rect
              x="90"
              y="190"
              width="200"
              height="12"
              rx="6"
              fill="#cbd5e1"
            />
          </g>
          <text
            x="70"
            y="300"
            fill="#000000ff"
            fontFamily="Inter"
            fontSize="18"
            fontWeight="700"
          >
            Seamless Digital Workspace
          </text>
        </svg>
      </div>
    </section>
  );
}
