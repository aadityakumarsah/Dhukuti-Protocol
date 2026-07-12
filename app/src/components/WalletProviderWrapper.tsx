"use client";

import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PublicKey } from "@solana/web3.js";
import { ShieldCheck, UsersRound, Vote, WalletCards } from "lucide-react";
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

function HomeContent() {
  const { connection, wallet, deriveGroup } = useDhukuti();
  const [selectedGroup, setSelectedGroup] = useState<PublicKey | null>(null);
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    connection.getGenesisHash().then((hash) => {
      if (hash === "EtWTRABZaYZqjoPVz3VQe7hMCrNzdhrbNH4YBL3zfXp") setNetworkName("Devnet");
      else if (hash === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") setNetworkName("Mainnet");
      else setNetworkName("Other");
    }).catch(() => setNetworkName("Unknown"));
  }, [connection]);

  const ownGroup = wallet ? deriveGroup(wallet.publicKey)[0] : null;

  function handleGroupCreated(address: PublicKey) {
    setSelectedGroup(address);
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Solana ROSCA protocol</p>
          <h1>Dhukuti Protocol</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
          Make sure your wallet is set to the same network.
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
        <CreateGroup onGroupCreated={handleGroupCreated} />
        <GroupDashboard groupAddress={selectedGroup} />
        <ContributionPanel groupAddress={selectedGroup} />
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
