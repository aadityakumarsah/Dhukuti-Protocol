import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

describe("dhukuti", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dhukuti as Program;
  const creator = provider.wallet.publicKey;
  const members = [anchor.web3.Keypair.generate(), anchor.web3.Keypair.generate()];

  const [group] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("group"), creator.toBuffer()],
    program.programId
  );
  const [vault] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), group.toBuffer()], program.programId);

  before(async () => {
    for (const member of members) {
      const signature = await provider.connection.requestAirdrop(member.publicKey, anchor.web3.LAMPORTS_PER_SOL);
      await provider.connection.confirmTransaction(signature, "confirmed");
    }
  });

  it("creates a group", async () => {
    await program.methods
      .createGroup(
        new anchor.BN(50_000_000),
        new anchor.BN(20_000_000),
        2,
        new anchor.BN(86_400),
        { vote: {} },
        50
      )
      .accounts({
        creator,
        group,
        vault,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();

    const account = await program.account.dhukutiGroup.fetch(group);
    expect(account.currentMembers).to.equal(0);
    expect(account.maxMembers).to.equal(2);
  });

  it("allows members to join and activates the group", async () => {
    for (const member of members) {
      const [memberPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("member"), group.toBuffer(), member.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .joinGroup()
        .accounts({
          wallet: member.publicKey,
          group,
          member: memberPda,
          vault,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([member])
        .rpc();
    }

    await program.methods.activateGroup().accounts({ creator, group }).rpc();
    const account = await program.account.dhukutiGroup.fetch(group);
    expect(account.currentMembers).to.equal(2);
    expect(account.status.active).to.deep.equal({});
  });
});
