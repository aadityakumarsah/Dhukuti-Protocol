export function DocsContent() {
  return (
    <div className="prose-custom max-w-none">
      <h1 id="what-is-dhukuti-protocol">What is Dhukuti Protocol?</h1>
      <p>
        Dhukuti Protocol is a <strong>trustless rotating savings</strong> system built on the{" "}
        <strong>Solana blockchain</strong>. It replaces traditional informal savings circles — known
        as Dhukuti in Nepal, Chit Fund in India, Susu in West Africa, Arisan in Indonesia, and
        Paluwagan in the Philippines — with a transparent, automated smart contract.
      </p>
      <p>
        In a traditional ROSCA (Rotating Savings and Credit Association), a group of people
        contributes a fixed amount every cycle. One member receives the full pool each cycle, and the
        rotation continues until everyone has received a payout once. The model works because
        communities trust each other, but that trust often breaks down.
      </p>
      <p>
        Dhukuti Protocol replaces organizer custody with Solana PDA escrow, adds on-chain
        contribution and payout records, supports group voting for payout allocation, and issues
        completion reputation that can become portable credit history for underbanked users.
      </p>

      <h3>What does this mean?</h3>
      <p>
        Imagine you and 4 friends want to save money together. Every week, everyone puts in some
        coins. Then one friend gets to take ALL the coins home. Next week, everyone puts in again,
        and a different friend takes all the coins. This keeps going until everyone has gotten a
        turn.
      </p>
      <p>
        Normally, you'd need to trust one person to hold all the coins — but what if they run away
        with it?
      </p>
      <p>
        Dhukuti Protocol is a special piggy bank on a computer that holds the coins for you. Nobody
        can take the coins unless everyone agrees. The computer checks the rules all by itself — so
        no one can cheat, run away, or take more than their turn.
      </p>

      <h2 id="the-problem">The Problem</h2>
      <p>
        Rotating savings groups are used by billions of people worldwide, especially in communities
        that are underbanked, mobile-first, and relationship-driven. However, the offline system has
        critical weaknesses:
      </p>
      <ul>
        <li>
          <strong>Organizer risk:</strong> The person holding the pool can disappear with everyone's
          money.
        </li>
        <li>
          <strong>Member default:</strong> Someone who receives an early payout can stop contributing.
        </li>
        <li>
          <strong>Opaque records:</strong> Payment status and payout order are often unclear, leading
          to disputes.
        </li>
        <li>
          <strong>No credit history:</strong> Participation in savings groups creates no formal
          financial record.
        </li>
        <li>
          <strong>Cross-border barriers:</strong> Diaspora members cannot easily participate in groups
          back home.
        </li>
        <li>
          <strong>Social pressure enforcement:</strong> Disputes rely on community pressure rather
          than transparent, enforceable rules.
        </li>
      </ul>

      <h2 id="the-solution">The Solution</h2>
      <p>Dhukuti Protocol moves the critical parts of a ROSCA on-chain using Solana smart contracts:</p>
      <ul>
        <li>
          <strong>No organizer custody:</strong> Funds are held in a PDA vault controlled by the smart
          contract, not by any person.
        </li>
        <li>
          <strong>Security deposits:</strong> Members stake a deposit when joining, which can be
          slashed if they default.
        </li>
        <li>
          <strong>Transparent tracking:</strong> Every contribution and payout is recorded on the
          Solana blockchain.
        </li>
        <li>
          <strong>Automated distribution:</strong> The program distributes the pool when all conditions
          are met.
        </li>
        <li>
          <strong>Community voting:</strong> Members vote on payout order (Janamat-style voting).
        </li>
        <li>
          <strong>Portable reputation:</strong> Successful completion creates an on-chain reputation
          attestation.
        </li>
      </ul>

      <h2 id="when-it-fails">When It Fails</h2>
      <p>Dhukuti Protocol handles most failure modes programmatically, but some scenarios remain:</p>
      <ul>
        <li>
          <strong>Grace period defaults:</strong> If a member misses a contribution, there is a 24-hour
          grace period. After that, their security deposit can be slashed.
        </li>
        <li>
          <strong>Insufficient SOL:</strong> If a member's wallet runs out of SOL for transaction fees,
          they cannot contribute or vote until they add funds.
        </li>
        <li>
          <strong>Network congestion:</strong> During high Solana network traffic, transactions may be
          delayed. The app retries automatically.
        </li>
        <li>
          <strong>RPC rate limits:</strong> Free public RPC endpoints can throttle requests. Using a
          private RPC provider mitigates this.
        </li>
        <li>
          <strong>Smart contract bugs:</strong> The protocol is an MVP and has not undergone a formal
          security audit.
        </li>
        <li>
          <strong>Social engineering:</strong> The protocol cannot prevent members from colluding
          off-chain or coercing others.
        </li>
      </ul>

      <h2 id="is-it-feasible">Is It Feasible?</h2>
      <p>
        <strong>Yes.</strong> The protocol is already deployed and functional on Solana devnet.
      </p>
      <ul>
        <li><strong>Low fees:</strong> Solana transactions cost fractions of a cent.</li>
        <li><strong>Fast finality:</strong> Transactions confirm in under a second.</li>
        <li>
          <strong>Proven technology:</strong> Built on Anchor framework and Solana's runtime.
        </li>
        <li>
          <strong>Frontend ready:</strong> Fully functional Next.js frontend on Vercel.
        </li>
        <li><strong>Open source:</strong> All code on GitHub for review and audit.</li>
      </ul>

      <h2 id="benefits">Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {[
          ["Trustless", "No single person controls the funds."],
          ["Transparent", "Every transaction is on the blockchain."],
          ["Secure", "Funds held in program-controlled vault."],
          ["Low Cost", "Fraction-of-a-cent transaction fees."],
          ["Portable Reputation", "On-chain credit history across groups."],
          ["Global", "Diaspora can join groups back home."],
          ["Automated", "Payouts execute when conditions are met."],
          ["Democratic", "Members vote on payout order."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <h2 id="why-use-dhukuti-protocol">Why Use Dhukuti Protocol?</h2>
      <p>Choose Dhukuti Protocol if you want:</p>
      <ul>
        <li>A savings system with no organizer who can run away with funds.</li>
        <li>Transparent contribution tracking that everyone can verify.</li>
        <li>Automatic payout execution without manual coordination.</li>
        <li>Deposit-backed security that deters and handles defaults.</li>
        <li>Community governance through transparent voting.</li>
        <li>Portable financial reputation for underbanked users.</li>
      </ul>

      <h2 id="when-to-use">When to Use</h2>
      <ul>
        <li>Community savings groups</li>
        <li>Underbanked populations without access to formal banking</li>
        <li>Diaspora communities participating in home-country savings</li>
        <li>Microfinance organizations</li>
        <li>Financial inclusion pilots</li>
      </ul>

      <h2 id="who-can-use-it">Who Can Use It</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium">Role</th>
              <th className="text-left py-2 px-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-2 px-3 font-medium">Group Creator</td>
              <td className="py-2 px-3 text-muted-foreground">Creates group, sets terms, activates</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 px-3 font-medium">Group Members</td>
              <td className="py-2 px-3 text-muted-foreground">Join, contribute, vote, receive payouts</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2 px-3 font-medium">Developers</td>
              <td className="py-2 px-3 text-muted-foreground">Fork, integrate, deploy custom groups</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="which-countries">Which Countries</h2>
      <p>
        Dhukuti Protocol is designed for any country where informal rotating savings groups exist:
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium">Region</th>
              <th className="text-left py-2 px-3 font-medium">Local Name</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Nepal", "Dhukuti"],
              ["India", "Chit Fund / Chitty"],
              ["West Africa", "Susu"],
              ["Indonesia", "Arisan"],
              ["Philippines", "Paluwagan"],
              ["East Africa", "Equb / Merry-Go-Round"],
              ["Caribbean", "Partner / Box Hand"],
              ["Korea", "Kye"],
              ["Japan", "Tanomoshi / Mujin"],
              ["China", "Hui"],
            ].map(([region, name]) => (
              <tr key={region} className="border-b border-border">
                <td className="py-2 px-3 font-medium">{region}</td>
                <td className="py-2 px-3 text-muted-foreground">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="privacy--policy">Privacy &amp; Policy</h2>
      <h3>On-Chain Data</h3>
      <p>
        All group data is stored on the Solana blockchain and is public by design. Wallet addresses
        are visible to anyone. No personally identifiable information (PII) is stored on-chain.
      </p>
      <h3>Off-Chain Data</h3>
      <p>
        The frontend does not collect or store personal data. No cookies, tracking, or analytics.
        No email, phone, or identity verification required.
      </p>
      <h3>Policy Principles</h3>
      <ul>
        <li>Transparency: All rules are encoded in the public smart contract.</li>
        <li>User control: Your wallet, your keys, your funds.</li>
        <li>Minimal data: Only blockchain-required data is stored.</li>
        <li>No custody: Funds held by smart contract, not by any person.</li>
      </ul>

      <h2 id="safety">Safety</h2>
      <h3>For Users</h3>
      <ul>
        <li>Your keys, your coins. Never share your seed phrase.</li>
        <li>Verify you are on the correct site.</li>
        <li>Start small on devnet before using real funds.</li>
        <li>Understand group terms before joining.</li>
        <li>Your deposit can be slashed if you miss contributions.</li>
      </ul>
      <h3>Technical Safety</h3>
      <ul>
        <li>Funds stored in PDAs only the smart contract can control.</li>
        <li>Open source for public security review.</li>
        <li>MVP not audited. Do not use with significant funds without audit.</li>
      </ul>

      <h2 id="how-it-works-technical-flow">How It Works (Technical Flow)</h2>
      <h3>Smart Contract Instructions</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium">Instruction</th>
              <th className="text-left py-2 px-3 font-medium">Description</th>
              <th className="text-left py-2 px-3 font-medium">Called By</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["createGroup", "Initialize a new group", "Any wallet"],
              ["joinGroup", "Join group, pay contribution + deposit", "Any wallet"],
              ["activateGroup", "Start first cycle", "Creator only"],
              ["contribute", "Pay contribution to vault", "Active member"],
              ["votePayout", "Vote for payout recipient (self-vote not allowed)", "Active member"],
              ["distribute", "Send pool to winner (supports Vote &amp; RoundRobin)", "Anyone"],
              ["slashDeposit", "Slash defaulter's deposit", "Creator"],
              ["claimReputation", "Mint completion reputation", "Member"],
              ["withdrawDeposit", "Return security deposit after completion", "Member"],
            ].map(([name, desc, caller]) => (
              <tr key={name} className="border-b border-border">
                <td className="py-2 px-3 font-mono text-xs">{name}</td>
                <td className="py-2 px-3 text-muted-foreground">{desc}</td>
                <td className="py-2 px-3 text-muted-foreground">{caller}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Program State Machine</h3>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm my-6 text-center">
        Forming → Active → (Cycle 1..N) → Completed
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘ Defaulted
      </div>
      <ol>
        <li>
          <strong>Forming:</strong> Group is accepting members. Creator sets terms. Members join.
        </li>
        <li>
          <strong>Active:</strong> Group is in an active cycle. Members contribute, vote, get paid.
        </li>
        <li>
          <strong>Completed:</strong> All members received a payout. Reputation can be claimed.
        </li>
        <li>
          <strong>Defaulted:</strong> A member missed contributions and was slashed.
        </li>
      </ol>

      <h2 id="how-the-app-works-user-flow">How the App Works (User Flow)</h2>

      <figure className="my-8 rounded-lg overflow-hidden border border-border">
        <img src="/images/app-layout.svg" alt="Dhukuti Protocol app layout overview" className="w-full" />
        <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/50">
          App layout: ① Connect wallet at top right &amp; check network ② App description with key features
          ③ Main workspace with all panels ④ Create Group form ⑤ Group Dashboard with status &amp; actions
          ⑥ Action panels: Join, Contribute, Vote, Claim
        </figcaption>
      </figure>

      <h3>1. Create Group</h3>
      <figure className="my-6 rounded-lg overflow-hidden border border-border">
        <img src="/images/create-group.svg" alt="Create Group form" className="w-full" />
        <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/50">
          ① Set contribution amount ② Set Members = 2 for testing ③ Click Create &amp; approve
          ④ Copy group address to share
        </figcaption>
      </figure>
      <p>
        One user (creator) fills the form with contribution amount, security deposit, max members,
        cycle days, and allocation method. The creator approves the transaction to create the group
        account. Status becomes <strong>Forming</strong>.
      </p>

      <h3>2. Members Join</h3>
      <p>
        Creator shares the group address. Each member pastes it in the Contribution Panel and clicks
        Join, approving the transaction that pays contribution + deposit to the vault. Creator also
        needs to Join.
      </p>

      <h3>3. Activate Group</h3>
      <figure className="my-6 rounded-lg overflow-hidden border border-border">
        <img src="/images/group-dashboard.svg" alt="Group Dashboard" className="w-full" />
        <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/50">
          ① Check status — must be "Active" ② Creator clicks Activate ③ Verify all members joined
          ④ Check vault balance on Solscan
        </figcaption>
      </figure>
      <p>
        Creator clicks Activate. Status changes to <strong>Active</strong>. Cycle 1 begins.
      </p>

      <h3>4. Each Cycle</h3>
      <figure className="my-6 rounded-lg overflow-hidden border border-border">
        <img src="/images/contribute-vote.svg" alt="Contribute and Vote panels" className="w-full" />
        <figcaption className="text-xs text-muted-foreground text-center py-2 bg-muted/50">
          ① First Join, then Contribute ② Paste nominee wallet address for voting ③ Approve in wallet
        </figcaption>
      </figure>
      <ol>
        <li>All members click <strong>Contribute</strong> (pays contribution to vault).</li>
        <li>Members <strong>Vote</strong> on who gets the payout.</li>
        <li>Anyone clicks <strong>Distribute</strong> to send the pool to the winner.</li>
        <li>Next cycle begins automatically.</li>
      </ol>

      <h3>4b. Round-Robin (No Voting)</h3>
      <p>
        If you select <strong>Round-robin</strong> as the allocation method when creating the group,
        skip the voting step entirely. Members receive payouts in join order — the first to join gets
        the first payout, the second gets the second, etc. Just Contribute → Distribute each cycle.
      </p>

      <h3>5. Completion</h3>
      <p>
        After all members have received a payout, status → <strong>Completed</strong>. Members can:
      </p>
      <ol>
        <li><strong>Claim Reputation</strong> — Mint an on-chain credit score.</li>
        <li><strong>Withdraw Deposit</strong> — Return your 0.02 SOL security deposit from the vault.</li>
      </ol>

      <div className="bg-muted rounded-lg p-4 text-center text-sm font-medium my-6">
        Create → Join → Activate → (Contribute → Vote → Distribute | RoundRobin: Contribute → Distribute) → Claim Reputation → Withdraw Deposit
      </div>

      <h2 id="how-to-use-it-for-a-5-year-old">How to Use It — For a 5 Year Old</h2>
      <p>Imagine you and your friends want to save money for toys.</p>
      <ol>
        <li>
          <strong>One friend makes a piggy bank</strong> — They decide how much everyone will put in
          each week, how many friends can join, and how long until someone gets the money.
        </li>
        <li>
          <strong>Everyone puts their coins in</strong> — All friends put coins into the piggy bank.
          Nobody can break it open unless everyone agrees.
        </li>
        <li>
          <strong>The piggy bank locks</strong> — Once everyone has put coins in, it locks. Time to
          decide who gets the coins first.
        </li>
        <li>
          <strong>Everyone votes</strong> — Each week, everyone puts in more coins, then votes on who
          takes all the coins home.
        </li>
        <li>
          <strong>One friend gets all the coins</strong> — The friend with the most votes gets ALL the
          coins! They can go buy a toy.
        </li>
        <li>
          <strong>Keep going</strong> — Next week, a different friend gets all the coins. This
          continues until every friend has gotten a turn.
        </li>
        <li>
          <strong>Done!</strong> — Everyone got to buy a toy and gets a special sticker that says "I'm
          good at saving with friends!"
        </li>
      </ol>
      <p>
        <strong>The best part:</strong> Nobody can cheat because the piggy bank is a computer that
        follows the rules perfectly. No running away with the money, no skipping turns, no arguments!
      </p>

      <h2 id="smart-contract-accounts">Smart Contract Accounts</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium">Account</th>
              <th className="text-left py-2 px-3 font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DhukutiGroup", "Stores group terms, vault, cycle state, and lifecycle status"],
              ["Member", "Tracks each member's participation and state"],
              ["VoteRecord", "Prevents duplicate voting in a cycle"],
              ["ReputationAttestation", "Records successful completion for portable reputation"],
            ].map(([name, purpose]) => (
              <tr key={name} className="border-b border-border">
                <td className="py-2 px-3 font-mono text-xs">{name}</td>
                <td className="py-2 px-3 text-muted-foreground">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="current-features">Current Features</h2>
      <ul>
        <li>Create a group with configurable terms</li>
        <li>Join a group by staking deposit + contribution</li>
        <li>Activate a group when all members have joined</li>
        <li>Contribute to the active cycle</li>
        <li>Vote for the cycle payout recipient</li>
        <li>Distribute the contribution pool</li>
        <li>Slash a defaulting member after grace period</li>
        <li>Claim completion reputation attestation</li>
        <li>Auto-load existing group on wallet connect</li>
        <li>Network detection with mismatch warning</li>
        <li>Explorer links and auto-refresh</li>
      </ul>

      <h2 id="mvp-limitations">MVP Limitations</h2>
      <ul>
        <li>Random and auction allocation not fully implemented — only Vote works</li>
        <li>Simple vote tally tracking only current leader</li>
        <li>IDL checked in; regenerate with anchor build after program changes</li>
        <li>zk proof utilities are placeholders, not production circuits</li>
        <li>Hackathon MVP — not audited production software</li>
        <li>Public devnet RPC may be rate-limited</li>
      </ul>

      <h2 id="step-by-step-user-guide">Step-by-Step User Guide</h2>
      <p>This guide walks through everything from setting up your wallet to completing a full group cycle.</p>

      <h3>1. Set Up Your Wallet</h3>
      <ol>
        <li>
          <strong>Install Solflare</strong> — Download the Solflare wallet extension for Chrome or your mobile browser from{" "}
          <a href="https://solflare.com" className="text-primary underline">solflare.com</a>.
        </li>
        <li>
          <strong>Create a wallet</strong> — Follow the setup wizard. Save your seed phrase somewhere safe (offline, not on your computer).
        </li>
        <li>
          <strong>Switch to Devnet</strong> — Click the gear icon → Network → <strong>Devnet</strong>.
          This is a test network with free play money. Never use real SOL until mainnet launch.
        </li>
      </ol>

      <h3>2. Get Free Devnet SOL</h3>
      <ol>
        <li>
          Copy your wallet address (click the copy icon next to your wallet name in Solflare).
        </li>
        <li>
          Go to <a href="https://faucet.solana.com" className="text-primary underline">faucet.solana.com</a>.
        </li>
        <li>
          Paste your address and request SOL. Do this <strong>twice</strong> so you have enough.
        </li>
        <li>
          You need at least <strong>0.1 SOL</strong> per wallet (0.05 contribution + 0.02 deposit + gas).
        </li>
        <li>
          If you plan to create and test with multiple wallets, fund each wallet separately.
        </li>
      </ol>

      <h3>3. Open the App</h3>
      <ol>
        <li>
          Visit <a href="https://dhukuti-protocol.vercel.app" className="text-primary underline">dhukuti-protocol.vercel.app</a>.
        </li>
        <li>
          Click <strong>Connect Wallet</strong> (top right) and select Solflare.
        </li>
        <li>
          Approve the connection in Solflare.
        </li>
        <li>
          Verify the top bar shows <strong>Devnet</strong> (not "Other" or "Mainnet").
        </li>
      </ol>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">⚠ Important: RPC Setup</p>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          The app uses <code>api.devnet.solana.com</code> by default, which has strict rate limits. If you see <strong>"429 rate limit"</strong> errors:
        </p>
        <ol className="text-sm text-amber-700 dark:text-amber-400 mt-2 ml-4 list-decimal space-y-1">
          <li>Go to <a href="https://helius.dev" className="underline">helius.dev</a>, sign up, and create a Devnet API key.</li>
          <li>In your deployed Vercel project (Settings → Environment Variables), set <code>NEXT_PUBLIC_SOLANA_RPC</code> to <code>https://devnet.helius-rpc.com/?api-key=YOUR_KEY</code>.</li>
          <li>Also set it in <code>app/.env</code> for local development.</li>
          <li>Redeploy or restart the dev server.</li>
        </ol>
      </div>

      <h3>4. Create a Group</h3>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">💡 Key Rule: Set Members = 2 for testing</p>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          The program requires <strong>all member slots to be filled</strong> before activation. If you set Members = 5, you need 5 people to join before you can activate. For testing, always set <strong>Members = 2</strong> (you + one other).
        </p>
      </div>
      <ol>
        <li>
          In the <strong>Create Dhukuti Group</strong> form, set:
          <ul>
            <li><strong>Contribution SOL:</strong> <code>0.05</code> (amount each member pays per cycle)</li>
            <li><strong>Security Deposit SOL:</strong> <code>0.02</code> (refundable deposit to prevent default)</li>
            <li><strong>Members:</strong> <code>2</code> (for testing with one other person)</li>
            <li><strong>Cycle Days:</strong> <code>30</code> (can be shorter for testing)</li>
            <li><strong>Allocation:</strong> <code>Janamat vote</code> (the only fully implemented method)</li>
            <li><strong>Protocol Fee BPS:</strong> <code>50</code> (0.5%)</li>
          </ul>
        </li>
        <li>Click <strong>Create</strong> and approve the transaction in Solflare.</li>
        <li>
          Wait for confirmation. You'll see the group address appear. <strong>Copy this address</strong> — you'll share it with the other member.
        </li>
        <li>
          The Group Dashboard will show: <strong>Status: Forming</strong>, <strong>Members: 0 / 2</strong>.
        </li>
      </ol>

      <h3>5. Join the Group (Both Wallets)</h3>
      <ol>
        <li>
          <strong>Creator must also join!</strong> The creator is NOT automatically a member. You must click <strong>Join</strong> yourself.
        </li>
        <li>
          In the <strong>Contribution</strong> panel, paste the group address and click <strong>Join</strong>.
        </li>
        <li>
          Approve the transaction. This creates your member account and transfers the security deposit to the vault.
        </li>
        <li>
          <strong>Switch wallets:</strong> Open a second Solflare wallet (create a new one or import via seed phrase on another device/browser).
        </li>
        <li>
          Connect the second wallet to the app, paste the group address, and click <strong>Join</strong>.
        </li>
        <li>
          The dashboard should now show: <strong>Members: 2 / 2</strong>.
        </li>
      </ol>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">🔍 Verify on Solscan</p>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Open <a href="https://solscan.io/?cluster=devnet" className="underline">Solscan Devnet</a> and search for the vault address (derived from your group). The vault should show <strong>0.04 SOL</strong> (2 × 0.02 deposit). If it shows 0 SOL, the deposits didn't transfer — check that both wallets had enough Devnet SOL.
        </p>
      </div>

      <h3>6. Activate the Group</h3>
      <ol>
        <li>
          <strong>Switch back to the creator wallet</strong> (the one that created the group).
        </li>
        <li>
          Look at the Group Dashboard — you should see a green <strong>Activate</strong> button in the button row.
        </li>
        <li>
          Click <strong>Activate</strong> and approve the transaction.
        </li>
        <li>
          The status changes to <strong>Active</strong>. Cycle 1 begins.
        </li>
      </ol>

      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">⚠ If Activate button doesn't appear</p>
        <p className="text-sm text-red-700 dark:text-red-400">
          Check that: (1) you're on the creator wallet, (2) Members shows <strong>2 / 2</strong>, (3) the vault has SOL. If still stuck, see the Troubleshooting section below.
        </p>
      </div>

      <h3>7. Contribute</h3>
      <ol>
        <li>
          Each member must click <strong>Contribute</strong> (NOT Join — you already joined) in the Contribution panel.
        </li>
        <li>
          Approve the transaction. This sends 0.05 SOL to the vault.
        </li>
        <li>
          Both members must contribute before distribution is possible.
        </li>
        <li>
          <strong>Important:</strong> If you see <strong>"AlreadyContributed"</strong>, that means you already contributed this cycle. Don't worry — just move to voting.
        </li>
      </ol>

      <h3>8. Vote</h3>
      <ol>
        <li>
          Go to the <strong>Janamat Vote</strong> panel.
        </li>
        <li>
          The group address should auto-fill. In the <strong>Payout nominee</strong> field, enter the wallet address of the person you want to receive the pool this cycle.
        </li>
        <li>
          Click <strong>Vote</strong> and approve.
        </li>
        <li>
          <strong>Both members should vote</strong> for the same person (or different — majority wins).
        </li>
      </ol>

      <h3>9. Distribute</h3>
      <ol>
        <li>
          After all members have contributed AND voted, the creator sees a <strong>Distribute</strong> button.
        </li>
        <li>
          Click it to send the full pool to the vote winner's wallet.
        </li>
        <li>
          The vault balance goes back to deposits-only. The next cycle begins.
        </li>
      </ol>

      <h3>10. Complete &amp; Claim Reputation</h3>
      <ol>
        <li>
          After all cycles are done (everyone has received a payout once), status becomes <strong>Completed</strong>.
        </li>
        <li>
          Individual members can go to the <strong>Reputation</strong> panel and click <strong>Claim</strong> to mint an on-chain reputation attestation.
        </li>
      </ol>

      <h2 id="troubleshooting">Troubleshooting Guide</h2>
      <p>Here are solutions for every error you might encounter, based on real testing.</p>

      <h3>Wallet &amp; Connection Issues</h3>

      <h4>"Connected to Other" instead of "Devnet"</h4>
      <p>The RPC genesis hash doesn't match. This is cosmetic — transactions still work. To fix:</p>
      <ul>
        <li>In Solflare settings, set Network to <strong>Devnet</strong>.</li>
        <li>Ensure the app's RPC is pointing to devnet (check <code>app/.env</code>).</li>
      </ul>

      <h4>Wallet says "Unknown site" / "Simulation failed"</h4>
      <p>This is normal for custom apps. The wallet can't simulate transactions on unknown sites. Click <strong>"I trust this site"</strong> and then <strong>Approve</strong>. The transaction will still execute correctly.</p>

      <h4>Transaction shows "429 rate limit exceeded"</h4>
      <p>You're hitting the public devnet RPC throttle. Fix:</p>
      <ol>
        <li>Get a free Helius API key from <a href="https://helius.dev" className="text-primary underline">helius.dev</a>.</li>
        <li>Set <code>NEXT_PUBLIC_SOLANA_RPC=https://devnet.helius-rpc.com/?api-key=YOUR_KEY</code> in your Vercel env vars and <code>app/.env</code>.</li>
        <li>Redeploy or restart the dev server.</li>
      </ol>

      <h3>Group Creation Issues</h3>

      <h4>"Account already in use" when creating a group</h4>
      <p>Each wallet can only create <strong>one</strong> group. The group PDA is derived from your wallet address. If you already created a group from this wallet, create a <strong>new wallet</strong> to create another group.</p>

      <h3>Group Activation Issues</h3>

      <h4>"GroupNotReady" (Error 6002)</h4>
      <p>This means <strong>not all member slots are filled</strong>. If you set <strong>Members = 5</strong>, you need 5 people to join before you can activate. For testing, create a new group with <strong>Members = 2</strong>.</p>

      <h4>Activate button doesn't appear</h4>
      <ol>
        <li>Check you're on the <strong>creator wallet</strong> (the one that clicked Create).</li>
        <li>Check Members shows <strong>X / X</strong> (all slots filled).</li>
        <li>Hard refresh the page (<code>Cmd+Shift+R</code>).</li>
        <li>Check the browser console for errors (<code>F12</code> → Console tab).</li>
      </ol>

      <h3>Contribution Issues</h3>

      <h4>"InvalidGroupStatus" (Error 6001)</h4>
      <p>You tried to contribute before the group was activated. Wait for the creator to click <strong>Activate</strong> first.</p>

      <h4>"AlreadyContributed" (Error 6003)</h4>
      <p>You already contributed this cycle. You don't need to contribute again — move on to <strong>Voting</strong>.</p>

      <h4>"AccountNotInitialized" for member</h4>
      <p>You tried to contribute without joining first. Click <strong>Join</strong> first, wait for it to confirm, then click <strong>Contribute</strong>.</p>

      <h4>"Allocate: account already in use" on Join</h4>
      <p>You already joined this group. The Join button won't work twice — just click <strong>Contribute</strong> instead.</p>

      <h3>Distribution Issues</h3>

      <h4>"instruction spent from the balance of an account it does not own"</h4>
      <p>The vault doesn't have enough SOL to distribute. Check that <strong>all members have contributed</strong> this cycle. If the vault is empty, this group may be stuck — create a new one.</p>

      <h4>"No vote leader yet"</h4>
      <p>No one has voted yet, or this is a <strong>RoundRobin</strong> group (no voting needed). All members need to go to the <strong>Vote</strong> panel and cast a vote for a nominee before distribution is possible. If using RoundRobin, just skip voting and click Distribute directly.</p>

      <h4>"CannotSelfVote" (Error 6012)</h4>
      <p>You tried to vote for yourself. Pick <strong>another</strong> member's wallet address as the nominee. The program rejects self-votes to prevent abuse.</p>

      <h4>"DepositAlreadyWithdrawn" (Error 6013)</h4>
      <p>You already withdrew your security deposit. Each member can only withdraw once, after the group is Completed.</p>

      <h3>How to Check On-Chain Data (Solscan)</h3>
      <p>
        Solscan is a block explorer for Solana. You can use it to verify all group activity:
      </p>
      <ol>
        <li>
          Go to <a href="https://solscan.io/?cluster=devnet" className="text-primary underline">solscan.io</a> and make sure you're on <strong>Devnet</strong> (top right dropdown).
        </li>
        <li>
          <strong>Check your wallet:</strong> Paste your wallet address to see balance and transaction history. Each transaction shows the fee, time, and status.
        </li>
        <li>
          <strong>Check the group PDA:</strong> Paste the group address (e.g., <code>8DuG9sCN...</code>). This is the group account with all its data.
        </li>
        <li>
          <strong>Check the vault PDA:</strong> The vault holds all member deposits and contributions. Look at the <strong>SOL Balance</strong> to see total funds.
          <ul>
            <li><strong>0 SOL</strong> — No one has paid in yet. Members need to Join/Contribute.</li>
            <li><strong>2 × deposit = 0.04 SOL</strong> — Members have joined but not yet contributed for the cycle.</li>
            <li><strong>2 × (deposit + contribution) = 0.14 SOL</strong> — Both members have joined AND contributed.</li>
          </ul>
        </li>
        <li>
          <strong>Check transactions:</strong> The <strong>Transactions</strong> tab shows every instruction executed on this account. Look for <code>createAccount</code> (member created), <code>transfer</code> (SOL moved), etc.
        </li>
      </ol>

      <h3>Common Pitfalls &amp; Best Practices</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium">Pitfall</th>
              <th className="text-left py-2 px-3 font-medium">Why It Happens</th>
              <th className="text-left py-2 px-3 font-medium">Fix</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Group stuck in Forming", "Not enough members joined", "Set Members = 2 for testing, or get more people to join"],
              ["Vault has 0 SOL", "Join transactions didn't transfer deposit", "Fund wallets with Devnet SOL from faucet first"],
              ["Distribute fails with No vote leader", "Using Vote allocation but no one voted", "Either vote or create a RoundRobin group instead"],
              ["Simulation failed popup", "Wallet can't simulate custom program", "Check 'I trust this site' and Approve"],
              ["Wrong network shown", "RPC connected to different cluster", "Set wallet and RPC both to Devnet"],
              ["Activate button hidden", "Enum comparison bug (fixed now)", "Redeploy latest code from main branch"],
            ].map(([pitfall, why, fix]) => (
              <tr key={pitfall} className="border-b border-border">
                <td className="py-2 px-3 font-medium">{pitfall}</td>
                <td className="py-2 px-3 text-muted-foreground">{why}</td>
                <td className="py-2 px-3 text-muted-foreground">{fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 my-6">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">✅ Quick Checklist for a Successful Group</p>
        <ol className="text-sm text-emerald-700 dark:text-emerald-400 mt-2 ml-4 list-decimal space-y-1">
          <li>Both wallets funded with Devnet SOL (0.1 SOL each min)</li>
          <li>Set Members = 2 when creating the group</li>
          <li>Creator joins too (not auto-added)</li>
          <li>Check vault has 0.04 SOL before activating</li>
          <li>Click Activate from creator wallet</li>
          <li>Both members click Contribute (once group is Active)</li>
          <li>Vote allocation: both members Vote a different wallet / RoundRobin: skip voting</li>
          <li>Anyone clicks Distribute each cycle</li>
          <li>After all cycles: Claim Reputation then Withdraw Deposit</li>
        </ol>
      </div>

      <h2 id="installation">Installation</h2>
      <div className="bg-muted rounded-lg p-4 my-6">
        <pre className="text-sm overflow-x-auto">
          <code>{`# Clone the repo
git clone https://github.com/aadityakumarsah/Dhukuti-Protocol.git
cd Dhukuti-Protocol

# Install frontend dependencies
npm --prefix app install

# Start the dev server
npm --prefix app run dev`}</code>
        </pre>
      </div>

      <h3>For Solana Program Development</h3>
      <div className="bg-muted rounded-lg p-4 my-6">
        <pre className="text-sm overflow-x-auto">
          <code>{`# Install Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Deploy to devnet (if anchor CLI is available)
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet

# On macOS ARM (no anchor CLI), use build-sbf directly
cargo build-sbf
solana program deploy --program-id keypair.json target/deploy/dhukuti.so`}</code>
        </pre>
      </div>

      <h2 id="quick-start">Quick Start</h2>
      <p>
        Visit <a href="https://dhukuti-protocol.vercel.app" className="text-primary underline">dhukuti-protocol.vercel.app</a>,
        connect your Solflare wallet set to Devnet, create a group, share the address, and have
        others join. Full workflow from Create to Completion is detailed above.
      </p>

      <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>
          Program ID (Devnet):{" "}
          <code className="bg-muted px-2 py-0.5 rounded text-xs">
            egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo
          </code>
        </p>
        <p className="mt-2">
          GitHub:{" "}
          <a
            href="https://github.com/aadityakumarsah/Dhukuti-Protocol"
            className="text-primary underline"
          >
            aadityakumarsah/Dhukuti-Protocol
          </a>
        </p>
      </div>
    </div>
  );
}
