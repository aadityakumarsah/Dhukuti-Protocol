import * as anchor from "@coral-xyz/anchor";
import { BN, Idl, Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";
import idl from "../app/src/idl/dhukuti.json";

// Full ROSCA lifecycle on a local validator:
// create -> join (x3) -> activate -> 3 cycles of contribute / vote / distribute -> reputation -> deposit refund.
describe("dhukuti", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new Program(idl as Idl, provider);
  const connection = provider.connection;

  const creator = provider.wallet.publicKey;
  const [alice, bob, carol] = [Keypair.generate(), Keypair.generate(), Keypair.generate()];
  const members = [alice, bob, carol];

  const CONTRIBUTION = new BN(0.05 * LAMPORTS_PER_SOL);
  const DEPOSIT = new BN(0.02 * LAMPORTS_PER_SOL);
  const FEE_BPS = 50; // 0.5%
  const salt = new BN(Date.now());

  const pda = (seeds: (Buffer | Uint8Array)[]) => PublicKey.findProgramAddressSync(seeds, program.programId)[0];
  const group = pda([Buffer.from("group"), creator.toBuffer(), salt.toArrayLike(Buffer, "le", 8)]);
  const vault = pda([Buffer.from("vault"), group.toBuffer()]);
  const memberPda = (w: PublicKey) => pda([Buffer.from("member"), group.toBuffer(), w.toBuffer()]);
  const votePda = (cycle: number, voter: PublicKey) =>
    pda([Buffer.from("vote"), group.toBuffer(), Buffer.from([cycle]), voter.toBuffer()]);
  const reputationPda = (w: PublicKey) => pda([Buffer.from("reputation"), group.toBuffer(), w.toBuffer()]);

  const fetchGroup = () => (program.account as any).dhukutiGroup.fetch(group);
  const fetchMember = (w: PublicKey) => (program.account as any).member.fetch(memberPda(w));

  async function expectError(promise: Promise<unknown>, code: string) {
    try {
      await promise;
    } catch (err: any) {
      const actual = [err?.error?.errorCode?.code, err?.message, ...(err?.logs ?? []), ...(err?.transactionLogs ?? [])].join(" ");
      expect(actual).to.contain(code);
      return;
    }
    expect.fail(`expected ${code}`);
  }

  const contribute = (m: Keypair) =>
    program.methods
      .contribute()
      .accounts({ wallet: m.publicKey, group, member: memberPda(m.publicKey), vault, systemProgram: SystemProgram.programId } as any)
      .signers([m])
      .rpc();

  const vote = async (voter: Keypair, nominee: PublicKey) => {
    const { currentCycle } = await fetchGroup();
    return program.methods
      .votePayout(nominee)
      .accounts({
        voter: voter.publicKey,
        group,
        voterMember: memberPda(voter.publicKey),
        voteRecord: votePda(currentCycle, voter.publicKey),
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([voter])
      .rpc();
  };

  const distribute = (recipient: PublicKey) =>
    program.methods
      .distribute()
      .accounts({
        authority: creator,
        group,
        recipientMember: memberPda(recipient),
        recipient,
        vault,
        systemProgram: SystemProgram.programId,
      } as any)
      .rpc();

  before(async () => {
    for (const m of members) {
      const sig = await connection.requestAirdrop(m.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(sig, "confirmed");
    }
  });

  it("creates a group in Forming state", async () => {
    await program.methods
      .createGroup(CONTRIBUTION, DEPOSIT, 3, new BN(86_400), { vote: {} }, FEE_BPS, salt)
      .accounts({ creator, group, vault, systemProgram: SystemProgram.programId } as any)
      .rpc();

    const g = await fetchGroup();
    expect(g.maxMembers).to.equal(3);
    expect(g.currentMembers).to.equal(0);
    expect(g.protocolFeeBps).to.equal(FEE_BPS);
    expect(g.status).to.have.property("forming");
  });

  it("rejects a protocol fee above 1%", async () => {
    const badSalt = new BN(1);
    const badGroup = pda([Buffer.from("group"), creator.toBuffer(), badSalt.toArrayLike(Buffer, "le", 8)]);
    await expectError(
      program.methods
        .createGroup(CONTRIBUTION, DEPOSIT, 3, new BN(86_400), { vote: {} }, 101, badSalt)
        .accounts({ creator, group: badGroup, vault: pda([Buffer.from("vault"), badGroup.toBuffer()]), systemProgram: SystemProgram.programId } as any)
        .rpc(),
      "InvalidProtocolFee"
    );
  });

  it("escrows deposit + first contribution in the PDA vault when members join", async () => {
    for (const m of members) {
      await program.methods
        .joinGroup()
        .accounts({ wallet: m.publicKey, group, member: memberPda(m.publicKey), vault, systemProgram: SystemProgram.programId } as any)
        .signers([m])
        .rpc();
    }
    const g = await fetchGroup();
    expect(g.currentMembers).to.equal(3);
    expect(g.contributionsThisCycle).to.equal(3);
    const expected = CONTRIBUTION.add(DEPOSIT).muln(3).toNumber();
    expect(await connection.getBalance(vault)).to.equal(expected);
  });

  it("only lets the creator activate a full group", async () => {
    await expectError(
      program.methods.activateGroup().accounts({ creator: alice.publicKey, group } as any).signers([alice]).rpc(),
      "ConstraintHasOne"
    );
    await program.methods.activateGroup().accounts({ creator, group } as any).rpc();
    expect((await fetchGroup()).status).to.have.property("active");
  });

  it("blocks double contributions and self-votes", async () => {
    await expectError(contribute(alice), "AlreadyContributed");
    await expectError(vote(alice, alice.publicKey), "CannotSelfVote");
  });

  it("cycle 0: only a voted member can be paid, payout = pool minus fee", async () => {
    await expectError(distribute(bob.publicKey), "VoteNotWon");

    await vote(alice, carol.publicKey);
    await vote(bob, carol.publicKey);

    const before = await connection.getBalance(carol.publicKey);
    await distribute(carol.publicKey);
    const after = await connection.getBalance(carol.publicKey);

    const pool = CONTRIBUTION.muln(3);
    const payout = pool.sub(pool.muln(FEE_BPS).divn(10_000));
    expect(after - before).to.equal(payout.toNumber());

    const g = await fetchGroup();
    expect(g.currentCycle).to.equal(1);
    expect(g.contributionsThisCycle).to.equal(0);
    expect((await fetchMember(carol.publicKey)).payoutReceived).to.equal(true);
  });

  it("cycle 1: refuses to distribute an incomplete pool or pay someone twice", async () => {
    await expectError(distribute(alice.publicKey), "PoolIncomplete");
    for (const m of members) await contribute(m);

    await vote(carol, alice.publicKey);
    await vote(bob, carol.publicKey);
    await expectError(distribute(carol.publicKey), "PayoutAlreadyReceived");

    await distribute(alice.publicKey);
    expect((await fetchGroup()).currentCycle).to.equal(2);
  });

  it("cycle 2: final payout completes the group", async () => {
    for (const m of members) await contribute(m);
    await vote(alice, bob.publicKey);
    await distribute(bob.publicKey);

    const g = await fetchGroup();
    expect(g.status).to.have.property("completed");
    for (const m of members) expect((await fetchMember(m.publicKey)).payoutReceived).to.equal(true);
  });

  it("issues an on-chain reputation attestation once per member", async () => {
    const claim = (m: Keypair) =>
      program.methods
        .claimReputation()
        .accounts({
          wallet: m.publicKey,
          group,
          member: memberPda(m.publicKey),
          attestation: reputationPda(m.publicKey),
          systemProgram: SystemProgram.programId,
        } as any)
        .signers([m])
        .rpc();

    await claim(alice);
    const att = await (program.account as any).reputationAttestation.fetch(reputationPda(alice.publicKey));
    expect(att.completedCycles).to.equal(3);
    expect(att.reputationScore).to.equal(300);
    await expectError(claim(alice), "already in use");
  });

  it("refunds security deposits after completion, exactly once", async () => {
    const withdraw = (m: Keypair) =>
      program.methods
        .withdrawDeposit()
        .accounts({ wallet: m.publicKey, group, member: memberPda(m.publicKey), vault, systemProgram: SystemProgram.programId } as any)
        .signers([m])
        .rpc();

    for (const m of members) await withdraw(m);
    await expectError(withdraw(alice), "DepositAlreadyWithdrawn");

    // Only the protocol fees (3 cycles x 0.5% of the pool) remain in escrow.
    const pool = CONTRIBUTION.muln(3);
    const fees = pool.muln(FEE_BPS).divn(10_000).muln(3).toNumber();
    expect(await connection.getBalance(vault)).to.equal(fees);
  });
});
