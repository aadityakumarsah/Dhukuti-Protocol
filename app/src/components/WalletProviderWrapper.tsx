"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PublicKey } from "@solana/web3.js";
import { ShieldCheck, UsersRound, Vote, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

import { ContributionPanel } from "@/components/ContributionPanel";
import { CreateGroup } from "@/components/CreateGroup";
import { GroupDashboard } from "@/components/GroupDashboard";
import { ReputationCard } from "@/components/ReputationCard";
import { VotingPanel } from "@/components/VotingPanel";
import { useDhukuti } from "@/hooks/useDhukuti";

function HomeContent() {
  const { wallet, deriveGroup } = useDhukuti();
  const [selectedGroup, setSelectedGroup] = useState<PublicKey | null>(null);

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
          <WalletMultiButton />
        </div>
      </header>

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
          <HomeContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
