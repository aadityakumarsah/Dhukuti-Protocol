"use client";

import { Activity, Copy, ExternalLink, Play, RefreshCw, Send } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

import { useDhukuti, DhukutiGroupData, MemberData, formatStatus, formatAllocation, getEnumKey } from "@/hooks/useDhukuti";
import { formatAnchorError } from "@/lib/anchorErrors";

function fromLamports(amount: { toString: () => string }): string {
  const val = Number(amount.toString()) / 1_000_000_000;
  return val.toFixed(3);
}

type Props = {
  groupAddress: PublicKey | null;
};

const LOADING_DEBOUNCE_MS = 300;

export function GroupDashboard({ groupAddress }: Props) {
  const { getGroup, getGroupMembers, connected, wallet, activateGroup, distribute } = useDhukuti();
  const [group, setGroup] = useState<DhukutiGroupData | null>(null);
  const [members, setMembers] = useState<{ publicKey: PublicKey; account: MemberData }[]>([]);
  const [copied, setCopied] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async () => {
    if (!groupAddress || !connected) {
      setGroup(null);
      setMembers([]);
      return;
    }

    const thisLoad = ++loadIdRef.current;

    const showLoading = new Promise<void>((resolve) => {
      loadingTimerRef.current = setTimeout(() => {
        if (loadIdRef.current === thisLoad) {
          setIsLoading(true);
        }
        resolve();
      }, LOADING_DEBOUNCE_MS);
    });

    try {
      const [groupData] = await Promise.all([
        getGroup(groupAddress),
        showLoading,
      ]);

      if (loadIdRef.current !== thisLoad) return;

      setGroup(groupData);
      if (groupData) {
        const membersData = await getGroupMembers(groupAddress);
        if (loadIdRef.current !== thisLoad) return;
        setMembers(membersData);
      } else {
        setMembers([]);
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
      if (loadIdRef.current === thisLoad) {
        setGroup(null);
      }
    } finally {
      if (loadIdRef.current === thisLoad) {
        setIsLoading(false);
        if (loadingTimerRef.current) {
          clearTimeout(loadingTimerRef.current);
          loadingTimerRef.current = null;
        }
      }
    }
  }, [groupAddress, connected, getGroup, getGroupMembers]);

  useEffect(() => {
    loadData();
    return () => {
      loadIdRef.current++;
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
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

  const groupFound = group !== null;
  const poolLamports = groupFound
    ? Number(group.contributionAmount.toString()) * group.currentMembers
    : 0;
  const poolSoFar = groupFound
    ? Number(group.totalContributedThisCycle.toString())
    : 0;
  const isCreator = groupFound && wallet?.publicKey.equals(group.creator);
  const isForming = groupFound && getEnumKey(group.status) === "forming";
  const isActive = groupFound && getEnumKey(group.status) === "active";
  const allContributed = groupFound && group.contributionsThisCycle >= group.currentMembers;

  async function handleActivate() {
    if (!groupAddress) return;
    setActionStatus("Activating group...");
    try {
      const sig = await activateGroup(groupAddress);
      setActionStatus(`Activated: ${sig.slice(0, 10)}...`);
      await loadData();
    } catch (e) {
      toast.error(formatAnchorError(e));
      setActionStatus("");
    }
  }

  async function handleDistribute() {
    if (!group) return;
    const method = getEnumKey(group.allocationMethod);
    let recipient: PublicKey;
    if (method === "vote") {
      let bestIdx = 0;
      for (let i = 0; i < group.voteCount; i++) {
        if (group.voteCounts[i] > group.voteCounts[bestIdx]) bestIdx = i;
      }
      recipient = group.voteNominees[bestIdx];
      if (!recipient || recipient.equals(PublicKey.default)) {
        toast.error("No vote leader yet. Vote first.");
        return;
      }
    } else if (method === "roundRobin") {
      recipient = members.find((m) => !m.account.payoutReceived)?.account.wallet ?? PublicKey.default;
      if (recipient.equals(PublicKey.default)) {
        toast.error("No unpaid member found for round-robin.");
        return;
      }
    } else {
      recipient = members.find((m) => !m.account.payoutReceived)?.account.wallet ?? PublicKey.default;
      if (recipient.equals(PublicKey.default)) {
        toast.error("No unpaid member found.");
        return;
      }
    }
    if (!groupAddress) return;
    setActionStatus("Distributing pool...");
    try {
      const sig = await distribute(groupAddress, recipient);
      setActionStatus(`Distributed: ${sig.slice(0, 10)}...`);
      await loadData();
      toast.success("Pool distributed!");
    } catch (e) {
      toast.error(formatAnchorError(e));
      setActionStatus("");
    }
  }

  return (
    <section className="panel large" style={{ position: "relative" }}>
      <h3>Group Dashboard</h3>

      {!groupFound && !isLoading ? (
        <>
          <p className="warning">Group not found on-chain.</p>
          <p className="muted" style={{ wordBreak: "break-all", fontSize: "0.78rem" }}>
            Address: {groupAddress.toBase58()}
          </p>
          <div className="button-row">
            <a
              className="secondary-button"
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={17} />
              Check on Explorer
            </a>
            <button className="secondary-button" type="button" onClick={loadData}>
              <RefreshCw size={17} />
              Retry
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="data-list" style={{ opacity: isLoading ? 0.35 : 1, transition: "opacity 0.15s" }}>
            <div className="data-row">
              <span>Status</span>
              <strong className={isLoading ? "skeleton-text" : "status-pill"}>
                {isLoading || !group ? "" : formatStatus(group.status)}
              </strong>
            </div>
            <div className="data-row">
              <span>Cycle</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${group.currentCycle} / ${group.maxMembers}`}
              </strong>
            </div>
            <div className="data-row">
              <span>Members</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${group.currentMembers} / ${group.maxMembers}`}
              </strong>
            </div>
            <div className="data-row">
              <span>Contribution</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${fromLamports(group.contributionAmount)} SOL`}
              </strong>
            </div>
            <div className="data-row">
              <span>Deposit</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${fromLamports(group.securityDeposit)} SOL`}
              </strong>
            </div>
            <div className="data-row">
              <span>Pool (full)</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${fromLamports({ toString: () => String(poolLamports) })} SOL`}
              </strong>
            </div>
            <div className="data-row">
              <span>Pool this cycle</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : `${fromLamports({ toString: () => String(poolSoFar) })} SOL`}
              </strong>
            </div>
            <div className="data-row">
              <span>Allocation</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : formatAllocation(group.allocationMethod)}
              </strong>
            </div>
            <div className="data-row">
              <span>Vault</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""}>
                {isLoading || !group ? "" : "PDA escrow"}
              </strong>
            </div>
            <div className="data-row">
              <span>Group address</span>
              <strong className={isLoading || !group ? "skeleton-text" : ""} style={isLoading || !group ? {} : { fontSize: "0.75rem" }}>
                {isLoading || !group ? "" : `${groupAddress.toBase58().slice(0, 16)}...`}
              </strong>
            </div>
          </div>

          <div className="button-row" style={{ opacity: isLoading ? 0.35 : 1, transition: "opacity 0.15s" }}>
            <button className="secondary-button" type="button" onClick={handleCopy}>
              <Copy size={17} />
              {copied ? "Copied!" : "Copy address"}
            </button>
            <a className="secondary-button" href={explorerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <ExternalLink size={17} />
              Explorer
            </a>
            <button className="secondary-button" type="button" onClick={loadData}>
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

          <div style={{ marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 20, opacity: isLoading ? 0.35 : 1, transition: "opacity 0.15s" }}>
            <h4 style={{ fontSize: "0.95rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span>Members List</span>
              <span style={{ fontSize: "0.8rem", fontWeight: "normal", color: "var(--muted)" }}>
                {isLoading || !group ? "" : `(${members.length} / ${group.maxMembers} joined)`}
              </span>
            </h4>
            {members.length === 0 && !isLoading ? (
              <p className="muted" style={{ fontSize: "0.82rem" }}>No members found. Share the group address to let others join!</p>
            ) : isLoading ? (
              <div className="skeleton-table" />
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
                          <td data-label="Wallet" style={{ padding: "8px 4px", fontWeight: isCurrentWallet ? "bold" : "normal" }}>
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
                          <td data-label="Contributed" style={{ padding: "8px 4px" }}>
                            {account.cyclesContributed} cycle{account.cyclesContributed !== 1 && "s"}
                          </td>
                          <td data-label="Paid Out" style={{ padding: "8px 4px" }}>
                            {account.payoutReceived ? (
                              <span style={{ color: "#166534", fontWeight: 500 }}>Yes (Cycle {account.payoutCycle})</span>
                            ) : (
                              <span style={{ color: "var(--muted)" }}>No</span>
                            )}
                          </td>
                          <td data-label="Reputation" style={{ padding: "8px 4px", textAlign: "right", fontWeight: 600 }}>
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
        </>
      )}
    </section>
  );
}
