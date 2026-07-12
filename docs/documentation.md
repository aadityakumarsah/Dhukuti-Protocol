# Dhukuti Protocol — Core Documentation

## Table of Contents

- [What is Dhukuti Protocol?](#what-is-dhukuti-protocol)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [When It Fails](#when-it-fails)
- [Is It Feasible?](#is-it-feasible)
- [Benefits](#benefits)
- [Why Use Dhukuti Protocol?](#why-use-dhukuti-protocol)
- [When to Use](#when-to-use)
- [Who Can Use It](#who-can-use-it)
- [Which Countries](#which-countries)
- [Privacy & Policy](#privacy--policy)
- [Safety](#safety)
- [How It Works (Technical Flow)](#how-it-works-technical-flow)
- [How the App Works (User Flow)](#how-the-app-works-user-flow)
- [How to Use It — For a 5 Year Old](#how-to-use-it--for-a-5-year-old)
- [Smart Contract Accounts](#smart-contract-accounts)
- [Current Features](#current-features)
- [MVP Limitations](#mvp-limitations)

---

## What is Dhukuti Protocol?

Dhukuti Protocol is a **trustless rotating savings** system built on the **Solana blockchain**. It replaces traditional informal savings circles — known as Dhukuti in Nepal, Chit Fund in India, Susu in West Africa, Arisan in Indonesia, and Paluwagan in the Philippines — with a transparent, automated smart contract.

A **ROSCA** (Rotating Savings and Credit Association) works like this: a group of people agrees to contribute a fixed amount of money at regular intervals. Each cycle, one member receives the entire pooled contribution. The rotation continues until every member has received a payout once.

Dhukuti Protocol automates this process using Solana smart contracts, removing the need for a trusted organizer, providing transparent records, and protecting against default.

---

## The Problem

Rotating savings groups are used by billions of people worldwide, especially in communities that are underbanked, mobile-first, and relationship-driven. However, the offline system has critical weaknesses:

- **Organizer risk:** The person holding the pool can disappear with everyone's money.
- **Member default:** Someone who receives an early payout can stop contributing.
- **Opaque records:** Payment status and payout order are often unclear, leading to disputes.
- **No credit history:** Participation in savings groups creates no formal financial record.
- **Cross-border barriers:** Diaspora members cannot easily participate in groups back home.
- **Social pressure enforcement:** Disputes rely on community pressure rather than transparent, enforceable rules.

---

## The Solution

Dhukuti Protocol moves the critical parts of a ROSCA on-chain using Solana smart contracts:

- **No organizer custody:** Funds are held in a Program Derived Address (PDA) vault controlled by the smart contract, not by any person.
- **Security deposits:** Members stake a deposit when joining, which can be slashed if they default.
- **Transparent tracking:** Every contribution and payout is recorded on the Solana blockchain.
- **Automated distribution:** The program distributes the pool when all conditions are met — no manual intervention required.
- **Community voting:** Members vote on payout order (Janamat-style voting).
- **Portable reputation:** Successful completion creates an on-chain reputation attestation that members can use in future groups or lending applications.

---

## When It Fails

Dhukuti Protocol handles most failure modes programmatically, but some scenarios remain:

- **Grace period defaults:** If a member misses a contribution, there is a 24-hour grace period. After that, their security deposit can be slashed and they are removed from the group.
- **Insufficient SOL:** If a member's wallet runs out of SOL for transaction fees, they cannot contribute or vote until they add funds.
- **Network congestion:** During high Solana network traffic, transactions may be delayed or fail. The app retries automatically.
- **RPC rate limits:** Free public RPC endpoints can throttle requests. Using a private RPC provider mitigates this.
- **Smart contract bugs:** The protocol is an MVP and has not undergone a formal security audit. Production use requires a professional audit.
- **Social engineering:** The protocol cannot prevent members from colluding off-chain or coercing others. It only enforces on-chain rules.

---

## Is It Feasible?

**Yes.** The protocol is already deployed and functional on Solana devnet. Key feasibility factors:

- **Low fees:** Solana transactions cost fractions of a cent, making small recurring contributions practical.
- **Fast finality:** Transactions confirm in under a second, suitable for mobile users.
- **Proven technology:** Built on Anchor framework and Solana's battle-tested runtime.
- **Frontend ready:** A fully functional Next.js frontend is deployed on Vercel at `dhukuti-protocol.vercel.app`.
- **Open source:** All code is available on GitHub for review, audit, and contribution.

Production readiness requires: a security audit, private RPC provider, mainnet deployment, and real SOL in the deployer wallet.

---

## Benefits

- **Trustless:** No single person controls the funds. The smart contract enforces all rules.
- **Transparent:** Every transaction is recorded on the Solana blockchain and verifiable by anyone.
- **Secure:** Funds are held in a program-controlled vault. Only the smart contract can release them under agreed conditions.
- **Low cost:** Solana's low transaction fees make it viable for small, frequent contributions.
- **Portable reputation:** Members build on-chain credit history that can be used across different groups and applications.
- **Global participation:** Diaspora members can join groups back home using any Solana wallet.
- **Automated:** Payouts execute automatically when conditions are met — no chasing or reminders.
- **Voting governance:** Members decide payout order democratically through on-chain voting.

---

## Why Use Dhukuti Protocol?

Choose Dhukuti Protocol if you want:

- A savings system with **no organizer** who can run away with funds.
- **Transparent contribution tracking** that everyone can verify.
- **Automatic payout execution** without manual coordination.
- **Deposit-backed security** that deters and handles defaults.
- **Community governance** through transparent voting on payout order.
- **Portable financial reputation** for underbanked users.
- A **provably fair** system where rules are enforced by code, not relationships.

---

## When to Use

- **Community savings groups:** Friends, family, or community members who want to save together regularly.
- **Underbanked populations:** People without access to formal banking or credit who already participate in informal savings circles.
- **Diaspora communities:** Migrants who want to participate in savings groups in their home country.
- **Microfinance organizations:** Groups looking for transparent, low-cost savings infrastructure.
- **Development organizations:** NGOs and cooperatives running community savings programs.
- **Financial inclusion pilots:** Projects testing blockchain-based financial products for underserved populations.

---

## Who Can Use It

| Role | Description |
|------|-------------|
| **Group Creator** | Anyone with a Solana wallet and some SOL for transaction fees. Creates the group, sets terms, activates after all join. |
| **Group Members** | Anyone with a Solana wallet. Join by paying contribution + deposit. Contribute, vote, receive payouts. |
| **Developers** | Can fork the repo, modify the protocol, build integrations using the SDK, or deploy custom groups. |
| **Researchers** | Study on-chain savings behavior, reputation systems, or community finance. |

**Requirements:**
- A Solana wallet (Solflare, Phantom, Backpack, etc.)
- Devnet SOL for testing (free from faucet)
- Mainnet SOL for real use

---

## Which Countries

Dhukuti Protocol is designed for any country where informal rotating savings groups exist. The name "Dhukuti" comes from Nepal, but similar systems exist worldwide:

| Region | Name |
|--------|------|
| Nepal | Dhukuti |
| India | Chit Fund / Chitty |
| West Africa | Susu |
| Indonesia | Arisan |
| Philippines | Paluwagan |
| East Africa | Equb (Ethiopia), Merry-Go-Round |
| Caribbean | Partner / Box Hand |
| Korea | Kye |
| Japan | Tanomoshi / Mujin |
| China | Hui / Rotating Credit Association |

Because the protocol runs on Solana, it works **globally** — any two people with internet access and a Solana wallet can form a group.

---

## Privacy & Policy

### On-Chain Data
- All group data (members, contributions, votes, payouts) is stored on the Solana blockchain and is **public** by design.
- Wallet addresses are visible to anyone viewing the blockchain.
- No personally identifiable information (PII) is stored on-chain.
- Member identities are pseudonymous (wallet addresses).

### Off-Chain Data
- The frontend (dhukuti-protocol.vercel.app) does **not** collect or store personal data.
- No cookies, tracking, or analytics are implemented in the current version.
- No email, phone, or identity verification is required.

### Policy Principles
- **Transparency:** All protocol rules are encoded in the public smart contract.
- **User control:** Your wallet, your keys, your funds. No one can access them without your signature.
- **Minimal data:** Only blockchain-required data is stored. No unnecessary collection.
- **No custody:** Funds are held by the smart contract, not by any company or individual.

---

## Safety

### For Users
- **Your keys, your coins:** Only you can sign transactions from your wallet. Never share your seed phrase.
- **Verify the site:** Ensure you are on `dhukuti-protocol.vercel.app` or the correct local URL.
- **Start small:** Test with small amounts on devnet before using real funds.
- **Understand the rules:** Read the group terms (contribution amount, deposit, cycle period) before joining.
- **Security deposit at risk:** If you miss a contribution, your deposit can be slashed. Set reminders.

### Technical Safety
- **Program-derived vaults:** Funds are stored in PDAs that only the smart contract can control.
- **No upgrade authority risk:** The deployed program has set authorities. Verify before trusting.
- **Open source:** The entire codebase is publicly visible for security review.
- **Audit needed:** The current version is an MVP. Do not use with significant real funds without a professional audit.

### Best Practices
1. Use a dedicated wallet for savings groups.
2. Never share your private keys or seed phrase.
3. Verify transaction details in your wallet before signing.
4. Test the full flow on devnet first.
5. Only join groups with people you trust off-chain.
6. Keep some extra SOL in your wallet for transaction fees.

---

## How It Works (Technical Flow)

### Smart Contract Instructions

| Instruction | Description | Who Can Call |
|-------------|-------------|--------------|
| `createGroup` | Initializes a new group with contribution amount, deposit, max members, cycle period, allocation method, and fee. Pays rent for account. | Any wallet |
| `joinGroup` | Creates a member account. Transfers contribution + security deposit from wallet to vault PDA. | Any wallet with a group address |
| `activateGroup` | Changes group status from "Forming" to "Active". Starts the first cycle. | Group creator only |
| `contribute` | Transfers contribution amount from wallet to vault. Marks member as contributed for the cycle. | Any active member |
| `votePayout` | Casts a vote for a nominee to receive the current cycle's payout. | Any active member who has contributed |
| `distribute` | Transfers the pooled contributions from vault to the winning member's wallet. | Anyone (after all have contributed and voting is complete) |
| `slashDeposit` | Forfeits a defaulter's security deposit to the treasury after the grace period. | Group creator |
| `claimReputation` | Mints a reputation attestation for a member who completed all cycles. | Any member who completed all cycles |

### Program State Machine

```
Forming → Active → (Cycle 1..N) → Completed
                  ↘ Defaulted
```

1. **Forming:** Group is accepting members. Creator sets terms. Members join by paying contribution + deposit.
2. **Active:** Group is in an active cycle. Members contribute, vote, and receive payouts.
3. **Completed:** All members have received a payout. Reputation can be claimed.
4. **Defaulted:** A member missed a contribution and was slashed. Group is terminated early.

---

## How the App Works (User Flow)

### Step-by-step Workflow

#### 1. Create Group (One person)
- One user (creator) fills the **Create Group** form with:
  - Contribution amount (e.g., 0.05 SOL)
  - Security deposit (e.g., 0.02 SOL)
  - Max members (e.g., 5)
  - Cycle days (e.g., 30)
  - Allocation method (Vote / Random / Auction)
  - Protocol fee in BPS (e.g., 50 = 0.5%)
- Creator approves the transaction to create the group account
- Group status becomes **"Forming"**

#### 2. Members Join
- Creator shares the **group address** with other members
- Each member:
  1. Goes to the **Contribution Panel** section
  2. Pastes the group address in the input field
  3. Clicks **Join**
  4. Approves the transaction in their wallet (pays **contribution + deposit** to the vault PDA)
- Creator also needs to **Join** (not auto-added as a member)
- After all members join, `current_members = max_members`

#### 3. Activate Group (Creator only)
- Creator clicks **Activate** on the Group Dashboard
- This starts **Cycle 1**
- Group status changes to **"Active"**
- The cycle timer begins

#### 4. Each Cycle (repeats for every member)
1. **Contribute:** All members click **Contribute** in the Contribution Panel (pays contribution amount to vault)
2. **Vote:** Members go to the **Voting Panel** and vote for who should receive the payout this cycle
3. **Distribute:** Once all members have contributed and voting is complete, anyone can click **Distribute**
4. The winner receives the **full pool** (all contributions minus protocol fee)
5. The next cycle begins automatically

#### 5. Completion
- After all members have received a payout, group status → **"Completed"**
- Members can go to the **Reputation Card** and click **Claim Reputation** to mint an on-chain credit score

### Summary
**Create → Join → Activate → Contribute → Vote → Distribute → Repeat until everyone gets paid.**

---

## How to Use It — For a 5 Year Old

Imagine you and your friends want to save money for toys.

1. **One friend makes a piggy bank** — They decide how much everyone will put in each week (like 1 coin), how many friends can join (like 5), and how long until someone gets the money.

2. **Everyone puts their coins in** — All friends put their coins into the piggy bank. The piggy bank is special — nobody can break it open unless everyone agrees.

3. **The piggy bank locks** — Once everyone has put their coins in, the piggy bank locks. Now it's time to decide who gets the coins first.

4. **Everyone votes** — Each week, everyone puts in more coins, and then they vote on who gets to take all the coins home.

5. **One friend gets all the coins** — The friend with the most votes gets ALL the coins from that week! They can go buy a toy.

6. **Keep going** — Next week, everyone puts in coins again, and a different friend gets all the coins. This keeps going until every friend has gotten a turn to take the coins home.

7. **Done!** — When everyone has gotten a turn, the piggy bank is empty and everyone got to buy a toy. Everyone also gets a special sticker that says "I'm good at saving with friends!" so they can use it next time.

**The best part:** Nobody can cheat because the piggy bank is a computer that follows the rules perfectly. No running away with the money, no skipping turns, no arguments!

---

## Smart Contract Accounts

| Account | Purpose | Fields |
|---------|---------|--------|
| `DhukutiGroup` | Stores group configuration, vault, cycle state, and lifecycle status | creator, vault, contribution_amount, security_deposit, max_members, current_members, cycle_period, cycle_started_at, current_cycle, allocation_method, status, protocol_fee_bps, total_contributed_this_cycle, contributions_this_cycle, current_recipient, vote_leader, vote_leader_count, bump, vault_bump |
| `Member` | Tracks each member's participation and state | group, wallet, cycles_contributed, last_contributed_cycle, payout_received, payout_cycle, security_deposit, is_active, reputation_score, reputation_claimed, bump |
| `VoteRecord` | Prevents duplicate voting in a cycle | group, cycle, voter, nominee, bump |
| `ReputationAttestation` | Records successful completion for portable reputation | member, wallet, group, completed_cycles, reputation_score, issued_at, bump |

---

## Current Features

- Create a Dhukuti group with configurable terms (contribution amount, security deposit, member cap, cycle period, allocation method, protocol fee)
- Join a group by staking security deposit and first contribution
- Activate a group when all members have joined
- Contribute to the active cycle
- Vote for the cycle payout recipient
- Distribute the contribution pool from the PDA vault
- Slash a defaulting member after the grace period
- Claim a completion reputation attestation
- Auto-load existing group when wallet connects
- Network detection (Devnet/Mainnet badge and mismatch warning)
- Copy group address to clipboard
- Explorer links for debugging
- Auto-refresh group data every 10 seconds

---

## MVP Limitations

- Random and auction allocation methods are present in the enum but not fully implemented — only Vote is operational
- Vote tally is intentionally simple and tracks only the current leader
- The frontend includes a checked-in IDL; after modifying the program, regenerate it with `anchor build`
- zk proof utilities are placeholders for demo structure, not production circuits
- The app is a hackathon MVP, not audited production software
- Public devnet RPC may be rate-limited — use a private RPC provider for demos

---

## Quick Start for Developers

```bash
# Clone the repo
git clone https://github.com/aadityakumarsah/Dhukuti-Protocol.git
cd Dhukuti-Protocol

# Install frontend dependencies
npm --prefix app install

# Start the dev server
npm --prefix app run dev

# Open http://localhost:3000
```

For full Solana program development:

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Deploy to devnet
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

---

## GitHub

Repository: [https://github.com/aadityakumarsah/Dhukuti-Protocol.git](https://github.com/aadityakumarsah/Dhukuti-Protocol.git)

Deployed Frontend: [https://dhukuti-protocol.vercel.app](https://dhukuti-protocol.vercel.app)

**Program ID (Devnet):** `egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo`
