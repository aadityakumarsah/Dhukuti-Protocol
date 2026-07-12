"use client";

import { Activity, Copy, ExternalLink, Play, RefreshCw, Send } from "lucide-react";
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
  const { getGroup, connected, wallet, activateGroup, distribute } = useDhukuti();
  const [group, setGroup] = useState<DhukutiGroupData | null | "loading">(null);
  const [copied, setCopied] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

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
        <p className="muted" style={{ wordBreak: "break-all", fontSize: "0.78rem" }}>
          Address: {groupAddress.toBase58()}
        </p>
        <div className="button-row">
          <a
            className="secondary-button"
            href={`https://explorer.solana.com/address/${groupAddress.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <ExternalLink size={17} />
            Check on Explorer
          </a>
          <button
            className="secondary-button"
            type="button"
            onClick={() => { setGroup("loading"); getGroup(groupAddress).then(setGroup); }}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  const poolLamports = Number(group.contributionAmount.toString()) * group.currentMembers;
  const poolSoFar = Number(group.totalContributedThisCycle.toString());
  const isCreator = wallet?.publicKey.equals(group.creator);
  const isForming = getEnumKey(group.status) === "Forming";
  const isActive = getEnumKey(group.status) === "Active";
  const allContributed = group.contributionsThisCycle >= group.currentMembers;

  async function handleActivate() {
    if (!groupAddress) return;
    setActionStatus("Activating group...");
    try {
      const sig = await activateGroup(groupAddress);
      setActionStatus(`Activated: ${sig.slice(0, 10)}...`);
      const data = await getGroup(groupAddress);
      setGroup(data);
    } catch (e) {
      setActionStatus(e instanceof Error ? e.message : "Activation failed.");
    }
  }

  async function handleDistribute() {
    if (!group || group === "loading") return;
    const recipient = group.voteLeader;
    if (recipient.equals(PublicKey.default)) {
      setActionStatus("No vote leader yet. Vote first.");
      return;
    }
    if (!groupAddress) return;
    setActionStatus("Distributing pool...");
    try {
      const sig = await distribute(groupAddress, recipient);
      setActionStatus(`Distributed: ${sig.slice(0, 10)}...`);
      const data = await getGroup(groupAddress);
      setGroup(data);
    } catch (e) {
      setActionStatus(e instanceof Error ? e.message : "Distribution failed.");
    }
  }

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
          <span>Deposit</span>
          <strong>{fromLamports(group.securityDeposit)} SOL</strong>
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
        {isCreator && isForming && (
          <button className="primary-button" type="button" onClick={handleActivate}>
            <Play size={17} />
            Activate
          </button>
        )}
        {isActive && allContributed && (
          <button className="primary-button" type="button" onClick={handleDistribute}>
            <Send size={17} />
            Distribute
          </button>
        )}
      </div>
      {actionStatus ? <p className="warning" style={{ marginTop: 12 }}>{actionStatus}</p> : null}
    </section>
  );
}
