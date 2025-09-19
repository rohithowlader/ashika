import React from "react";

export default function Topbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu}>
        ☰
      </button>
      <div className="search-wrap">
        <input className="search" placeholder="Search something..." />
      </div>
      <div className="who">
        <div className="avatar">CS</div>
        <div className="meta">
          <div className="name">Chirag Singh</div>
          <div className="mail">chirag@schika.com</div>
        </div>
      </div>
    </header>
  );
}
