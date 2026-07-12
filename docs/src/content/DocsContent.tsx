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
              ["votePayout", "Vote for payout recipient", "Active member"],
              ["distribute", "Send pool to winner", "Anyone"],
              ["slashDeposit", "Slash defaulter's deposit", "Creator"],
              ["claimReputation", "Mint completion reputation", "Member"],
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
      <h3>1. Create Group</h3>
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
      <p>
        Creator clicks Activate. Status changes to <strong>Active</strong>. Cycle 1 begins.
      </p>

      <h3>4. Each Cycle</h3>
      <ol>
        <li>All members click <strong>Contribute</strong> (pays contribution to vault).</li>
        <li>Members <strong>Vote</strong> on who gets the payout.</li>
        <li>Anyone clicks <strong>Distribute</strong> to send the pool to the winner.</li>
        <li>Next cycle begins automatically.</li>
      </ol>

      <h3>5. Completion</h3>
      <p>
        After all members have received a payout, status → <strong>Completed</strong>. Members can
        Claim Reputation for an on-chain credit score.
      </p>

      <div className="bg-muted rounded-lg p-4 text-center text-sm font-medium my-6">
        Create → Join → Activate → Contribute → Vote → Distribute → Repeat until everyone gets paid.
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

# Deploy to devnet
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet`}</code>
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
