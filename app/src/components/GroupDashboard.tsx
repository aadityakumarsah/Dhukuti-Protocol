"use client";

import { Activity, Copy, ExternalLink } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

import { useDhukuti, DhukutiGroupData, formatStatus, formatAllocation, getEnumKey } from "@/hooks/useDhukuti";

function fromLamports(amount: { toString: () => string }): string {
  const val = Number(amount.toString()) / 1_000_000_000;
  return val.toFixed(3);
}

type Props = {
  groupAddress: PublicKey | null;
};

export function GroupDashboard({ groupAddress }: Props) {
  const { getGroup, connected } = useDhukuti();
  const [group, setGroup] = useState<DhukutiGroupData | null | "loading">(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!groupAddress || !connected) {
      setGroup(null);
      return;
    }
    setGroup("loading");
    getGroup(groupAddress).then((data) => setGroup(data));
    const interval = setInterval(() => {
      if (groupAddress) {
        getGroup(groupAddress).then((data) => setGroup(data));
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [groupAddress, connected, getGroup]);

  if (!groupAddress) {
    return (
      <section className="panel large">
        <h3>Group Dashboard</h3>
        <p className="muted">Create or join a group to see its details here.</p>
      </section>
    );
  }

  const explorerUrl = `https://explorer.solana.com/address/${groupAddress.toBase58()}?cluster=devnet`;

  async function handleCopy() {
    if (!groupAddress) return;
    await navigator.clipboard.writeText(groupAddress.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (group === "loading") {
    return (
      <section className="panel large">
        <h3>Group Dashboard</h3>
        <p className="muted">Loading group data...</p>
      </section>
    );
  }

  if (!group) {
    return (
      <section className="panel large">
        <h3>Group Dashboard</h3>
        <p className="warning">Group not found on-chain.</p>
        <p className="muted">Address: {groupAddress.toBase58().slice(0, 12)}...</p>
      </section>
    );
  }

  const poolLamports = Number(group.contributionAmount.toString()) * group.currentMembers;
  const poolSoFar = Number(group.totalContributedThisCycle.toString());

  return (
    <section className="panel large">
      <h3>Group Dashboard</h3>
      <div className="data-list">
        <div className="data-row">
          <span>Status</span>
          <strong className="status-pill">{formatStatus(group.status)}</strong>
        </div>
        <div className="data-row">
          <span>Cycle</span>
          <strong>{group.currentCycle} / {group.maxMembers}</strong>
        </div>
        <div className="data-row">
          <span>Members</span>
          <strong>{group.currentMembers} / {group.maxMembers}</strong>
        </div>
        <div className="data-row">
          <span>Contribution</span>
          <strong>{fromLamports(group.contributionAmount)} SOL</strong>
        </div>
        <div className="data-row">
          <span>Pool (full)</span>
          <strong>{fromLamports({ toString: () => String(poolLamports) })} SOL</strong>
        </div>
        <div className="data-row">
          <span>Pool this cycle</span>
          <strong>{fromLamports({ toString: () => String(poolSoFar) })} SOL</strong>
        </div>
        <div className="data-row">
          <span>Allocation</span>
          <strong>{formatAllocation(group.allocationMethod)}</strong>
        </div>
        <div className="data-row">
          <span>Vault</span>
          <strong>PDA escrow</strong>
        </div>
        <div className="data-row">
          <span>Group address</span>
          <strong style={{ fontSize: "0.75rem" }}>{groupAddress.toBase58().slice(0, 16)}...</strong>
        </div>
      </div>
      <div className="button-row">
        <button className="secondary-button" type="button" onClick={handleCopy}>
          <Copy size={17} />
          {copied ? "Copied!" : "Copy address"}
        </button>
        <a className="secondary-button" href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <ExternalLink size={17} />
          Explorer
        </a>
        <button className="secondary-button" type="button" onClick={() => { setGroup("loading"); getGroup(groupAddress).then(setGroup); }}>
          <Activity size={17} />
          Refresh
        </button>
      </div>
    </section>
  );
}
