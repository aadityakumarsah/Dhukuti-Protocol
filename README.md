# Dhukuti Protocol

Dhukuti Protocol is a trustless rotating savings protocol on Solana. It brings informal savings circles, known as Dhukuti in Nepal, Chit Fund in India, Susu in West Africa, Arisan in Indonesia, and Paluwagan in the Philippines, into transparent smart-contract escrow.

In a traditional ROSCA, a group of people contributes a fixed amount every cycle. One member receives the full pool each cycle, and the rotation continues until everyone has received a payout once. The model works because communities trust each other, but that trust often breaks down when organizers disappear with funds, members default after receiving an early payout, or nobody has a reliable record of who paid.

Dhukuti Protocol replaces organizer custody with Solana PDA escrow, adds on-chain contribution and payout records, supports group voting for payout allocation, and issues completion reputation that can become portable credit history for underbanked users.

### What does this mean?

Imagine you and 4 friends want to save money together. Every week, everyone puts in some coins. Then one friend gets to take ALL the coins home. Next week, everyone puts in again, and a different friend takes all the coins. This keeps going until everyone has gotten a turn.

Normally, you'd need to trust one person to hold all the coins — but what if they run away with it?

Dhukuti Protocol is a special piggy bank on a computer that holds the coins for you. Nobody can take the coins unless everyone agrees. The computer checks the rules all by itself — so no one can cheat, run away, or take more than their turn.

## Problem

Rotating savings groups are used by billions of people, especially in communities that are underbanked, mobile-first, and relationship-driven. The offline system has serious weaknesses:

- Organizers can abscond with the pool.
- Members can default after receiving their payout.
- Payment status and payout order are often opaque.
- Informal groups usually create no credit history.
- Diaspora members struggle to participate safely across borders.
- Disputes depend on social pressure instead of transparent rules.

## Solution

Dhukuti Protocol moves the critical parts of a ROSCA on-chain:

- Funds are held in a Solana PDA vault, not by an organizer.
- Members stake a security deposit when joining.
- Contributions are tracked per member and per cycle.
- Payouts are distributed by the program when the pool is complete.
- Janamat-style voting lets members choose the payout recipient.
- Deposits can be slashed after a missed contribution grace period.
- Completion creates a reputation attestation for future groups or lending apps.

## Why Solana

Solana is a strong fit for community savings because fees are low enough for small recurring payments, finality is fast enough for mobile users, and Anchor makes the escrow program auditable and easy to extend.

Useful Solana primitives in this project:

- Program Derived Addresses for group vaults and deterministic account discovery.
- Anchor accounts for group, member, vote, and reputation state.
- Fast and low-cost transactions for small contributions.
- Wallet Adapter for web wallet connectivity.
- Future compatibility with Solana Mobile, compressed state, token extensions, and zk reputation proofs.

## Current Features

- Create a Dhukuti group with contribution amount, security deposit, member cap, cycle period, allocation method, and protocol fee.
- Join a group by staking the security deposit and first contribution.
- Activate a group when all members have joined.
- Contribute to the active cycle.
- Vote for the cycle payout recipient.
- Distribute the contribution pool from the PDA vault.
- Slash a defaulting member after the grace period.
- Claim a completion reputation attestation.
- Use a Next.js frontend to interact with the core flows.
- Use SDK helpers to derive all major PDAs.

## Repository Structure

```text
.
├── Anchor.toml
├── Cargo.toml
├── programs/
│   └── dhukuti/
│       └── src/
│           ├── lib.rs
│           ├── state.rs
│           ├── errors.rs
│           └── instructions/
├── app/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       └── utils/
├── sdk/
│   └── src/index.ts
├── tests/
│   └── dhukuti.ts
└── README.md
```

## Prerequisites

For the frontend:

- Node.js 20 or newer
- npm

For full Solana program build and tests:

- Rust and Cargo
- Solana CLI
- Anchor CLI

This machine currently has Node and Cargo. The Anchor CLI and Solana CLI are not installed, so `anchor build` and `anchor test` require installing those first.

## Quick Start: Frontend

From the project root:

```bash
npm --prefix app install
npm --prefix app run dev
```

Open:

```text
http://localhost:3000
```

If port 3000 is busy, Next.js will choose another port and print it in the terminal.

## Run On Port 3000 Explicitly

```bash
cd /Users/aadityasah/Desktop/st-sol
npm --prefix app run dev -- -p 3000
```

Then open:

```text
http://localhost:3000
```

## Build Frontend

```bash
npm --prefix app run build
```

The production build has been verified successfully.

## Check Rust Program

```bash
cargo fmt --check
cargo check
```

Both commands pass in the current repo. Host builds may show Anchor/Solana macro `cfg` warnings; those are common when checking Anchor programs outside the BPF build target.

## Install Solana CLI

Install from the official Solana release channel:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Restart your shell, then verify:

```bash
solana --version
solana-keygen --version
```

Create a local wallet if needed:

```bash
solana-keygen new
solana config set --url localhost
```

## Install Anchor CLI

Using Anchor Version Manager:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
anchor --version
```

This project uses Anchor dependencies pinned to `0.31.1`. If you want the closest CLI match:

```bash
avm install 0.31.1
avm use 0.31.1
```

## Build And Test Anchor Program

After Solana CLI and Anchor CLI are installed:

```bash
npm install
anchor build
anchor test
```

The program id currently deployed on devnet is:

```text
egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo
```

If you generate a new keypair with Anchor, update all three places:

- `Anchor.toml`
- `programs/dhukuti/src/lib.rs`
- `app/src/hooks/useDhukuti.ts`

## Frontend Environment Variables

Copy the example file:

```bash
cp app/.env.example app/.env.local
```

Then edit `app/.env.local` if you want to override defaults:

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_DHUKUTI_PROGRAM_ID=egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo
```

For devnet:

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

## Make The App Fully Usable

The hosted frontend only becomes useful for real users after the Solana program is deployed to the same cluster configured in `NEXT_PUBLIC_SOLANA_RPC`.

For local testing, use localnet:

```bash
solana-test-validator
```

In another terminal:

```bash
solana config set --url localhost
anchor build
anchor deploy
npm --prefix app run dev -- -p 3000
```

For public testing, use devnet:

```bash
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

After deployment, Anchor prints the deployed program id. Put that id in:

- `Anchor.toml`
- `programs/dhukuti/src/lib.rs`
- `app/.env.local`
- Vercel environment variable `NEXT_PUBLIC_DHUKUTI_PROGRAM_ID`

Then rebuild the frontend.

## Host The Frontend

The simplest hosting path is Vercel because this is a Next.js app.

### Option 1: Vercel Dashboard

1. Push this repo to GitHub.
2. Open Vercel and choose `Add New Project`.
3. Import `aadityakumarsah/Dhukuti-Protocol`.
4. Set the root directory to:

```text
app
```

5. Use these build settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

6. Add environment variables:

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_DHUKUTI_PROGRAM_ID=<your_deployed_program_id>
```

7. Deploy.

### Option 2: Vercel CLI

Install and login:

```bash
npm install -g vercel
vercel login
```

Deploy from the app directory:

```bash
cd app
vercel
```

When prompted:

```text
Set up and deploy: yes
Framework: Next.js
Build Command: npm run build
Output Directory: .next
```

Set production environment variables:

```bash
vercel env add NEXT_PUBLIC_SOLANA_RPC production
vercel env add NEXT_PUBLIC_DHUKUTI_PROGRAM_ID production
vercel --prod
```

## Host The Smart Contract

The Solana program is not hosted on Vercel. It must be deployed to a Solana cluster.

Use devnet for demos:

```bash
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

Use mainnet only after audit and real treasury planning:

```bash
solana config set --url mainnet-beta
anchor build
anchor deploy --provider.cluster mainnet-beta
```

For mainnet, you need real SOL in the deployer wallet and should not use this MVP without a security audit.

## Production Checklist

Before inviting real users:

- Deploy the program to devnet or mainnet.
- Update frontend env vars to the deployed program id.
- Replace demo program id in source if you generated a new keypair.
- Run `anchor test`.
- Run `npm --prefix app run build`.
- Test with at least two wallets.
- Confirm group creation, joining, contribution, vote, and reputation flows on the target cluster.
- Add monitoring for failed transactions and RPC errors.
- Use a paid RPC provider for public demos instead of relying on public devnet RPC.
- Get a smart contract audit before handling real funds.

## Common Problems

### Wallet connects but transactions fail

Check that:

- `NEXT_PUBLIC_SOLANA_RPC` points to the same cluster where the program is deployed.
- `NEXT_PUBLIC_DHUKUTI_PROGRAM_ID` is the deployed program id.
- Your wallet is on the same network.
- Your wallet has SOL for transaction fees and contributions.

### `anchor` command not found

Install Anchor Version Manager:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.31.1
avm use 0.31.1
```

### `solana` command not found

Install Solana CLI:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Restart your terminal and run:

```bash
solana --version
```

### Vercel build cannot find dependencies

Make sure the Vercel project root directory is set to:

```text
app
```

Do not set the root to the repository root unless you also change the Vercel build command to:

```bash
npm --prefix app install && npm --prefix app run build
```

## How The Protocol Works

### Step-by-step Workflow

#### 1. Create Group (One person)
- One user (creator) fills the **Create Group** form with:
  - Contribution amount (e.g., 0.05 SOL)
  - Security deposit (e.g., 0.02 SOL)
  - Max members (e.g., 5)
  - Cycle days (e.g., 30)
- Creator pays the creation fee — just creates the group account (no SOL transferred yet)
- Group status becomes **"Forming"**

#### 2. Members Join
- Creator shares the **group address** with other members
- Each member pastes the group address in the **Contribution Panel** and clicks **Join**
- Each member approves the transaction (pays **contribution + deposit** to the vault PDA)
- Creator also needs to **Join** (not auto-added)
- After all members join, `current_members = max_members`

#### 3. Activate Group (Creator only)
- Creator clicks **Activate** on the Group Dashboard
- This starts **Cycle 1**
- Group status changes to **"Active"**

#### 4. Each Cycle (repeats for every member)
- All members click **Contribute** (pays contribution amount to vault)
- Members **Vote** on who should get the payout this cycle
- When all contributed and voting ends, anyone can click **Distribute**
- The winner receives the **full pool** (all contributions minus protocol fee)
- Next cycle begins automatically

#### 5. Completion
- After all members have received a payout, group status → **"Completed"**
- Members can **Claim Reputation** (on-chain credit score for future groups)

### Summary
**Create → Join → Activate → Contribute → Vote → Distribute → Repeat until everyone gets paid.**

## Main Accounts

- `DhukutiGroup`: stores group terms, vault, cycle status, fee, current vote leader, and lifecycle status.
- `Member`: stores each member wallet, contribution progress, payout state, deposit, active status, and reputation score.
- `VoteRecord`: prevents duplicate voting by the same wallet in a cycle.
- `ReputationAttestation`: records successful completion for future portable reputation.

## MVP Limitations

- Random and auction allocation are present in the enum but not fully implemented.
- Vote tally is intentionally simple and tracks the current leader.
- The frontend includes a checked-in IDL for this MVP; after changing the program, regenerate it with `anchor build`.
- zk proof utilities are placeholders for demo structure, not production circuits.
- The app is a hackathon MVP, not audited production software.

## Why Use Dhukuti Protocol

Use Dhukuti Protocol if you want to demonstrate or build a community savings product that has:

- No organizer custody.
- Transparent contribution tracking.
- Automatic payout execution.
- Deposit-backed default deterrence.
- Community governance through voting.
- A path toward financial reputation for people without formal credit history.

## Demo Pitch

Dhukuti Protocol replaces trust-based rotating savings with smart-contract escrow, helping community finance groups save together without relying on a single organizer and giving reliable members a portable financial reputation.

## GitHub

Repository remote:

```text
https://github.com/aadityakumarsah/Dhukuti-Protocol.git
```
