# Dhukuti Protocol

> Trustless rotating savings on Solana.

**Dhukuti** (Nepal), **Chit Fund** (India), **Susu** (West Africa), **Arisan** (Indonesia), **Paluwagan** (Philippines) — billions of people rely on informal rotating savings circles. Dhukuti Protocol replaces organizer custody with Solana smart-contract escrow.

📖 **[Read the docs →](https://docsdhukuti-protocol.vercel.app/)**  
🌐 **[Launch the app →](https://dhukuti-protocol.vercel.app)**

---

## Problem

- Organizers can run away with the pool.
- Members can default after receiving their payout.
- Nobody has a reliable record of who paid.
- Informal groups build no credit history for underbanked users.
- Cross-border participation is difficult without trust.

## Solution

Dhukuti Protocol moves ROSCA funds and rules on-chain:

- Funds held in a **Solana PDA vault** — no organizer custody.
- Members stake a **security deposit** when joining.
- Contributions tracked **per member and per cycle**.
- **Janamat-style voting** lets members choose payout recipients.
- **Deposits can be slashed** after missed contributions.
- Completion creates a **reputation attestation** for future groups.

## How It Works

```
Create → Join → Activate → Contribute → Vote → Distribute → Repeat → Claim Reputation
```

1. **Create** — One person creates a group (sets contribution amount, deposit, member cap, cycle days).
2. **Join** — Each member joins by paying contribution + deposit to the vault PDA.
3. **Activate** — Creator starts Cycle 1.
4. **Contribute** — All members pay the contribution each cycle.
5. **Vote** — Members vote on who gets the payout this round.
6. **Distribute** — The winner receives the full pool (minus protocol fee).
7. **Repeat** — Next cycle starts automatically until every member has received a payout.
8. **Claim Reputation** — On-chain credit score for future groups.

---

## Prerequisites

| Tool | Version | Needed for |
|------|---------|------------|
| Node.js | ≥20 | Frontend |
| Rust + Cargo | latest | Program build |
| Solana CLI | v4.1.1 | Deploy + test |
| Anchor CLI | 0.31.1 | Program build + test |

## Quick Start (Frontend Only)

```bash
npm --prefix app install
npm --prefix app run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Full Setup (Program + Frontend)

### 1. Install Solana CLI

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Restart shell, then:

```bash
solana --version
solana-keygen new
solana config set --url devnet
```

### 2. Install Anchor CLI

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.31.1
avm use 0.31.1
```

### 3. Build & Deploy Program

```bash
anchor build
anchor deploy --provider.cluster devnet
```

### 4. Configure Frontend

```bash
cp app/.env.example app/.env.local
```

Edit `app/.env.local`:

```
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_DHUKUTI_PROGRAM_ID=<your_deployed_program_id>
```

### 5. Run Frontend

```bash
npm --prefix app run dev
```

---

## Deployment

### Program (Solana)

```bash
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

Current deployed program ID: `egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo`

### Frontend (Vercel)

1. Push repo to GitHub.
2. On Vercel, import `aadityakumarsah/Dhukuti-Protocol`.
3. Set **Root Directory** to `app`.
4. Set **Framework Preset** to Next.js.
5. Add environment variables:
   - `NEXT_PUBLIC_SOLANA_RPC`
   - `NEXT_PUBLIC_DHUKUTI_PROGRAM_ID`
6. Deploy.

---

## Repository Structure

```
.
├── Anchor.toml               # Anchor config (devnet)
├── programs/dhukuti/src/     # Solana program (Rust)
│   ├── lib.rs
│   ├── state.rs
│   ├── errors.rs
│   └── instructions/
├── app/                      # Next.js frontend
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       └── utils/
├── sdk/src/index.ts          # SDK helpers (PDA derivation)
├── tests/dhukuti.ts          # Anchor tests
└── docs/                     # Documentation site (Bun + React)
```

---

## Accounts

| Account | Purpose |
|---------|---------|
| `DhukutiGroup` | Group terms, vault, cycle status, fee, lifecycle |
| `Member` | Wallet, contributions, payout state, deposit, reputation |
| `VoteRecord` | Prevents duplicate voting per cycle |
| `ReputationAttestation` | Completion proof for portable credit |

---

## MVP Limitations

- Random and auction allocation methods are declared but not fully implemented.
- Vote tally tracks the current leader (simple design).
- zk reputation proofs are placeholders.
- Not audited — do not use with real funds.

---

## Links

- **App**: [dhukuti-protocol.vercel.app](https://dhukuti-protocol.vercel.app)
- **Docs**: [docsdhukuti-protocol.vercel.app](https://docsdhukuti-protocol.vercel.app)
- **GitHub**: [github.com/aadityakumarsah/Dhukuti-Protocol](https://github.com/aadityakumarsah/Dhukuti-Protocol)
