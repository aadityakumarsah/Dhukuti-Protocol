# Dhukuti Protocol

Dhukuti Protocol is a trustless rotating savings protocol on Solana. It brings informal savings circles, known as Dhukuti in Nepal, Chit Fund in India, Susu in West Africa, Arisan in Indonesia, and Paluwagan in the Philippines, into transparent smart-contract escrow.

In a traditional ROSCA, a group of people contributes a fixed amount every cycle. One member receives the full pool each cycle, and the rotation continues until everyone has received a payout once. The model works because communities trust each other, but that trust often breaks down when organizers disappear with funds, members default after receiving an early payout, or nobody has a reliable record of who paid.

Dhukuti Protocol replaces organizer custody with Solana PDA escrow, adds on-chain contribution and payout records, supports group voting for payout allocation, and issues completion reputation that can become portable credit history for underbanked users.

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

The program id currently configured in `Anchor.toml`, the Rust program, and the frontend fallback is:

```text
3XxJ1AQGdvUKbSwksUKoew5xDZK1p7q48vvBhQejBHHt
```

If you generate a new keypair with Anchor, update all three places:

- `Anchor.toml`
- `programs/dhukuti/src/lib.rs`
- `app/src/hooks/useDhukuti.ts`

## Frontend Environment Variables

Create `app/.env.local` if you want to override defaults:

```bash
NEXT_PUBLIC_SOLANA_RPC=http://127.0.0.1:8899
NEXT_PUBLIC_DHUKUTI_PROGRAM_ID=3XxJ1AQGdvUKbSwksUKoew5xDZK1p7q48vvBhQejBHHt
```

For devnet:

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

## How The Protocol Works

1. A creator creates a group with fixed terms.
2. Members join by depositing a security stake and first contribution.
3. The creator activates the group once membership is full.
4. Members contribute every cycle.
5. Members vote on the payout recipient.
6. The program distributes the pool from the vault.
7. The cycle advances until all members have received a payout.
8. Members claim reputation after successful completion.

## Main Accounts

- `DhukutiGroup`: stores group terms, vault, cycle status, fee, current vote leader, and lifecycle status.
- `Member`: stores each member wallet, contribution progress, payout state, deposit, active status, and reputation score.
- `VoteRecord`: prevents duplicate voting by the same wallet in a cycle.
- `ReputationAttestation`: records successful completion for future portable reputation.

## MVP Limitations

- Random and auction allocation are present in the enum but not fully implemented.
- Vote tally is intentionally simple and tracks the current leader.
- The frontend currently uses a placeholder IDL until `anchor build` generates the real IDL.
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
