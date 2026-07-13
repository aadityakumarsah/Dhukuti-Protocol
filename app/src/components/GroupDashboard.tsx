"use client";

import { Activity, Copy, ExternalLink, Play, RefreshCw, Send } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState, useCallback } from "react";

import { useDhukuti, DhukutiGroupData, MemberData, formatStatus, formatAllocation, getEnumKey } from "@/hooks/useDhukuti";

function fromLamports(amount: { toString: () => string }): string {
  const val = Number(amount.toString()) / 1_000_000_000;
  return val.toFixed(3);
}

type Props = {
  groupAddress: PublicKey | null;
};

export function GroupDashboard({ groupAddress }: Props) {
  const { getGroup, getGroupMembers, connected, wallet, activateGroup, distribute } = useDhukuti();
  const [group, setGroup] = useState<DhukutiGroupData | null | "loading">(null);
  const [members, setMembers] = useState<{ publicKey: PublicKey; account: MemberData }[]>([]);
  const [copied, setCopied] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const loadData = useCallback(async (showLoading = false) => {
    if (!groupAddress || !connected) {
      setGroup(null);
      setMembers([]);
      return;
    }
    if (showLoading) {
      setGroup("loading");
    }
    try {
      const groupData = await getGroup(groupAddress);
      setGroup(groupData);
      if (groupData) {
        const membersData = await getGroupMembers(groupAddress);
        setMembers(membersData);
      } else {
        setMembers([]);
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
      if (showLoading) {
        setGroup(null);
      }
    }
  }, [groupAddress, connected, getGroup, getGroupMembers]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

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
            onClick={() => loadData(true)}
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
      await loadData();
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
      await loadData();
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
        <button className="secondary-button" type="button" onClick={() => loadData(true)}>
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

      <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
        <h4 style={{ fontSize: "0.95rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span>Members List</span>
          <span style={{ fontSize: "0.8rem", fontWeight: "normal", color: "var(--muted)" }}>
            ({members.length} / {group.maxMembers} joined)
          </span>
        </h4>
        {members.length === 0 ? (
          <p className="muted" style={{ fontSize: "0.82rem" }}>No members found. Share the group address to let others join!</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="members-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <th style={{ padding: "8px 4px", color: "var(--muted)", fontWeight: 500 }}>Wallet Address</th>
                  <th style={{ padding: "8px 4px", color: "var(--muted)", fontWeight: 500 }}>Contributed</th>
                  <th style={{ padding: "8px 4px", color: "var(--muted)", fontWeight: 500 }}>Paid Out?</th>
                  <th style={{ padding: "8px 4px", color: "var(--muted)", fontWeight: 500, textAlign: "right" }}>Reputation</th>
                </tr>
              </thead>
              <tbody>
                {members.map(({ publicKey, account }) => {
                  const isCurrentWallet = wallet?.publicKey.equals(account.wallet);
                  const displayAddress = account.wallet.toBase58();
                  const shortAddress = `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`;
                  return (
                    <tr key={publicKey.toBase58()} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "8px 4px", fontWeight: isCurrentWallet ? "bold" : "normal" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span 
                            style={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: "50%", 
                              background: account.isActive ? "#166534" : "#b91c1c",
                              display: "inline-block" 
                            }} 
                            title={account.isActive ? "Active member" : "Inactive member"}
                          />
                          <span title={displayAddress}>{shortAddress}</span>
                          {isCurrentWallet && (
                            <span style={{ 
                              fontSize: "0.7rem", 
                              padding: "1px 4px", 
                              background: "var(--primary)", 
                              color: "white", 
                              borderRadius: 4 
                            }}>
                              You
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ padding: "8px 4px" }}>
                        {account.cyclesContributed} cycle{account.cyclesContributed !== 1 && "s"}
                      </td>
                      <td style={{ padding: "8px 4px" }}>
                        {account.payoutReceived ? (
                          <span style={{ color: "#166534", fontWeight: 500 }}>Yes (Cycle {account.payoutCycle})</span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>No</span>
                        )}
                      </td>
                      <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600 }}>
                        {account.reputationScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
