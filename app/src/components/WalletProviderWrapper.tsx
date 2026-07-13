"use client";

import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PublicKey } from "@solana/web3.js";
import { ShieldCheck, UsersRound, Vote, WalletCards, BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ContributionPanel } from "@/components/ContributionPanel";
import { CreateGroup } from "@/components/CreateGroup";
import { GroupDashboard } from "@/components/GroupDashboard";
import { ReputationCard } from "@/components/ReputationCard";
import { VotingPanel } from "@/components/VotingPanel";
import { useDhukuti } from "@/hooks/useDhukuti";

function AutoReconnect() {
  const { wallet, connect, connected } = useWallet();

  useEffect(() => {
    if (!connected && wallet) {
      connect().catch(() => {});
    }
  }, [wallet, connect, connected]);

  return null;
}

function NetworkBadge({ detected }: { detected: string }) {
  const color = detected === "Devnet" ? "#0f766e" : detected === "Mainnet" ? "#b45309" : "#657067";
  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color,
        border: `1px solid ${color}`,
        borderRadius: 6,
        padding: "3px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {detected || "..."}
    </span>
  );
}

function GroupSelector({
  selectedGroup,
  setSelectedGroup,
  savedGroups,
  saveGroupAddress,
  getGroup,
  connected
}: {
  selectedGroup: PublicKey | null;
  setSelectedGroup: (pubkey: PublicKey | null) => void;
  savedGroups: string[];
  saveGroupAddress: (addr: string) => void;
  getGroup: (address: PublicKey) => Promise<any>;
  connected: boolean;
}) {
  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleLoad = async (addressStr: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!addressStr.trim()) {
      setErrorMsg("Please enter a group address.");
      return;
    }
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(addressStr.trim());
    } catch {
      setErrorMsg("Invalid group address format.");
      return;
    }

    try {
      const data = await getGroup(pubkey);
      if (data) {
        setSelectedGroup(pubkey);
        saveGroupAddress(pubkey.toBase58());
        const deselected: string[] = JSON.parse(localStorage.getItem("dhukuti_deselected") || "[]");
        localStorage.setItem("dhukuti_deselected", JSON.stringify(deselected.filter((a) => a !== pubkey.toBase58())));
        setSuccessMsg("Group loaded successfully!");
        setInputVal("");
      } else {
        setErrorMsg("Group not found on-chain.");
      }
    } catch (e) {
      setErrorMsg("Error loading group details.");
    }
  };

  const handleCopy = async () => {
    if (!selectedGroup) return;
    await navigator.clipboard.writeText(selectedGroup.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel" style={{ gridColumn: "span 12", marginBottom: 8 }}>
      <h3 style={{ margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "inline-flex", padding: 6, background: "var(--bg)", borderRadius: 6, color: "var(--primary)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </span>
        Group Selector & Quick Switcher
      </h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
        {/* Active Group Details */}
        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Active Selection</p>
          {selectedGroup ? (
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #b9f6ca",
              borderRadius: 6,
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ 
                  background: "#166534", 
                  color: "white", 
                  fontSize: "0.7rem", 
                  fontWeight: "bold", 
                  padding: "2px 6px", 
                  borderRadius: 4,
                  textTransform: "uppercase"
                }}>
                  Active
                </span>
                <span style={{ fontSize: "0.78rem", fontFamily: "monospace", wordBreak: "break-all", fontWeight: 500 }}>
                  {selectedGroup.toBase58()}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button 
                  className="secondary-button" 
                  style={{ minHeight: 28, height: 28, padding: "0 8px", fontSize: "0.75rem" }} 
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy Address"}
                </button>
                <button 
                  className="secondary-button" 
                  style={{ minHeight: 28, height: 28, padding: "0 8px", fontSize: "0.75rem", background: "#fee2e2", color: "#b91c1c" }} 
                  onClick={() => {
                    setSelectedGroup(null);
                    if (selectedGroup) {
                      const deselected = JSON.parse(localStorage.getItem("dhukuti_deselected") || "[]");
                      const addr = selectedGroup.toBase58();
                      if (!deselected.includes(addr)) {
                        localStorage.setItem("dhukuti_deselected", JSON.stringify([...deselected, addr]));
                      }
                    }
                  }}
                >
                  Deselect
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#fffbeb",
              border: "1px solid #fef3c7",
              borderRadius: 6,
              padding: "12px",
              fontSize: "0.82rem",
              color: "#b45309"
            }}>
              No active group selected. Load an existing group by address below or select from your recent groups.
            </div>
          )}
        </div>

        {/* Load Group Form */}
        <div style={{ flex: "1 1 300px", minWidth: "280px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Load Group Address</p>
          <div className="group-selector-input-row" style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Paste 44-character group PDA"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{ minHeight: 38, height: 38, padding: "8px 10px", fontSize: "0.82rem" }}
              disabled={!connected}
            />
            <button
              className="primary-button"
              style={{ minHeight: 38, height: 38, padding: "0 12px", fontSize: "0.82rem", whiteSpace: "nowrap" }}
              disabled={!connected}
              onClick={() => handleLoad(inputVal)}
            >
              Load Group
            </button>
          </div>
          {errorMsg && <p className="warning" style={{ margin: "4px 0 0 0", fontSize: "0.78rem" }}>{errorMsg}</p>}
          {successMsg && <p style={{ margin: "4px 0 0 0", fontSize: "0.78rem", color: "#166534", fontWeight: 500 }}>{successMsg}</p>}
        </div>
      </div>

      {/* Saved Groups switcher */}
      {savedGroups.length > 0 && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>Recent Groups</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {savedGroups.map((address) => {
              const isActive = selectedGroup?.toBase58() === address;
              const short = `${address.slice(0, 8)}...${address.slice(-6)}`;
              return (
                <button
                  key={address}
                  onClick={() => handleLoad(address)}
                  className="secondary-button"
                  style={{
                    minHeight: 28,
                    height: 28,
                    padding: "0 10px",
                    fontSize: "0.75rem",
                    border: isActive ? "1.5px solid var(--primary)" : "1px solid var(--line)",
                    background: isActive ? "#e6fffa" : "#f5f6f4",
                    fontWeight: isActive ? "bold" : "normal"
                  }}
                  title={address}
                  disabled={!connected}
                >
                  {short}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeContent() {
  const { connection, wallet, deriveGroup, getGroup, getUserGroups, connected, program } = useDhukuti();
  const [selectedGroup, setSelectedGroup] = useState<PublicKey | null>(null);
  const [networkName, setNetworkName] = useState("");
  const [savedGroups, setSavedGroups] = useState<string[]>([]);

  useEffect(() => {
    connection.getGenesisHash().then((hash) => {
      if (hash === "EtWTRABZaYZqjoPVz3VQe7hMCrNzdhrbNH4YBL3zfXp") setNetworkName("Devnet");
      else if (hash === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") setNetworkName("Mainnet");
      else setNetworkName("Other");
    }).catch(() => setNetworkName("Unknown"));
  }, [connection]);

  useEffect(() => {
    const saved = localStorage.getItem("dhukuti_saved_groups");
    if (saved) {
      try {
        setSavedGroups(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (connected && wallet && program) {
      getUserGroups(wallet.publicKey).then((memberships) => {
        const deselected: string[] = JSON.parse(localStorage.getItem("dhukuti_deselected") || "[]");
        memberships.forEach((membership) => {
          saveGroupAddress(membership.account.group.toBase58());
        });
        const toSelect = memberships.find(
          (m) => !deselected.includes(m.account.group.toBase58())
        );
        if (toSelect) {
          setSelectedGroup((prev) => prev || toSelect.account.group);
        }
      });
    }
  }, [connected, wallet, program, getUserGroups]);

  const saveGroupAddress = (addressStr: string) => {
    if (!addressStr) return;
    try {
      new PublicKey(addressStr);
    } catch {
      return;
    }
    setSavedGroups((prev) => {
      if (prev.includes(addressStr)) return prev;
      const updated = [addressStr, ...prev];
      localStorage.setItem("dhukuti_saved_groups", JSON.stringify(updated));
      return updated;
    });
  };

  const ownGroupStr = wallet?.publicKey?.toBase58();
  const ownGroup = useMemo(() => {
    if (!wallet || !deriveGroup) return null;
    return deriveGroup(wallet.publicKey)[0];
  }, [ownGroupStr, deriveGroup]);

  useEffect(() => {
    if (!connected || !ownGroup || !program) return;
    getGroup(ownGroup).then((data) => {
      if (data) {
        saveGroupAddress(ownGroup.toBase58());
      }
    });
  }, [connected, ownGroup, getGroup, program]);

  function handleGroupCreated(address: PublicKey) {
    setSelectedGroup(address);
    saveGroupAddress(address.toBase58());
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <svg
            className="logo-icon"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
            <circle cx="16" cy="16" r="9" stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.2" />
            <circle cx="16" cy="16" r="2" fill="var(--primary)" opacity="0.8" />
            <circle cx="16" cy="2" r="1.8" fill="var(--primary)" opacity="0.9" />
            <circle cx="30" cy="16" r="1.8" fill="var(--primary)" opacity="0.7" />
            <circle cx="16" cy="30" r="1.8" fill="var(--primary)" opacity="0.5" />
            <circle cx="2" cy="16" r="1.8" fill="var(--primary)" opacity="0.6" />
          </svg>
          <div>
            <p className="eyebrow">Solana ROSCA protocol</p>
            <h1>Dhukuti Protocol</h1>
          </div>
        </div>
        <div className="topbar-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <a
            href="https://docsdhukuti-protocol.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
            style={{ 
              fontSize: "0.78rem", 
              padding: "0 12px", 
              minHeight: 36, 
              height: 36, 
              textDecoration: "none", 
              display: "inline-flex", 
              alignItems: "center",
              gap: 6
            }}
          >
            <BookOpen size={15} />
            Docs
          </a>
          {ownGroup && selectedGroup?.toBase58() !== ownGroup.toBase58() && (
            <button
              className="secondary-button"
              type="button"
              onClick={() => setSelectedGroup(ownGroup)}
              style={{ fontSize: "0.78rem", padding: "0 10px", minHeight: 36 }}
            >
              My group
            </button>
          )}
          <NetworkBadge detected={networkName} />
          <WalletMultiButton />
        </div>
      </header>

      {networkName && networkName !== "Unknown" && (
        <div style={{
          background: "#f0fdf4",
          borderBottom: "1px solid #86efac",
          padding: "6px clamp(18px, 5vw, 64px)",
          fontSize: "0.8rem",
          color: "#166534",
          textAlign: "center",
        }}>
          Connected to <strong>{networkName}</strong>.
          <span className="network-hint"> Make sure your wallet is set to the same network.</span>
        </div>
      )}



      <section className="hero">
        <div className="hero-copy">
          <h2>Trustless rotating savings for community finance.</h2>
          <p>
            Create a savings circle, escrow contributions in a PDA vault, vote on payout order, and issue portable
            on-chain reputation after completion.
          </p>
        </div>
        <div className="metrics-grid" aria-label="Protocol highlights">
          <div>
            <ShieldCheck />
            <strong>PDA escrow</strong>
            <span>No organizer custody</span>
          </div>
          <div>
            <Vote />
            <strong>Janamat voting</strong>
            <span>On-chain allocation</span>
          </div>
          <div>
            <WalletCards />
            <strong>Deposit staking</strong>
            <span>Slash defaults</span>
          </div>
          <div>
            <UsersRound />
            <strong>Reputation</strong>
            <span>Credit history for members</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <GroupSelector
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          savedGroups={savedGroups}
          saveGroupAddress={saveGroupAddress}
          getGroup={getGroup}
          connected={connected}
        />
        <CreateGroup onGroupCreated={handleGroupCreated} />
        <GroupDashboard groupAddress={selectedGroup} />
        <ContributionPanel groupAddress={selectedGroup} onGroupSelected={(addr) => {
          setSelectedGroup(addr);
          saveGroupAddress(addr.toBase58());
        }} />
        <VotingPanel groupAddress={selectedGroup} />
        <ReputationCard groupAddress={selectedGroup} />
      </section>
    </main>
  );
}

export default function WalletProviderWrapper() {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC ?? "http://127.0.0.1:8899";
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AutoReconnect />
          <HomeContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
