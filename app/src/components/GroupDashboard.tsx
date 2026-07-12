"use client";

import { Activity, Copy } from "lucide-react";

export function GroupDashboard() {
  return (
    <section className="panel large">
      <h3>Group Dashboard</h3>
      <div className="data-list">
        <div className="data-row">
          <span>Status</span>
          <strong className="status-pill">Forming</strong>
        </div>
        <div className="data-row">
          <span>Current cycle</span>
          <strong>0 / 5</strong>
        </div>
        <div className="data-row">
          <span>Contribution pool</span>
          <strong>0.25 SOL</strong>
        </div>
        <div className="data-row">
          <span>Vault custody</span>
          <strong>PDA escrow</strong>
        </div>
      </div>
      <div className="button-row">
        <button className="secondary-button" type="button">
          <Copy size={17} />
          Copy invite
        </button>
        <button className="secondary-button" type="button">
          <Activity size={17} />
          Refresh
        </button>
      </div>
    </section>
  );
}
