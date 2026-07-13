"use client";

import { AnchorProvider, BN, Idl, Program, setProvider, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useMemo, useCallback } from "react";

import dhukutiIdl from "@/idl/dhukuti.json";

export const DHUKUTI_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_DHUKUTI_PROGRAM_ID ?? "egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo"
);

type EnumObject = { [key: string]: {} };

export type DhukutiGroupData = {
  creator: PublicKey;
  vault: PublicKey;
  contributionAmount: BN;
  securityDeposit: BN;
  maxMembers: number;
  currentMembers: number;
  cyclePeriod: BN;
  cycleStartedAt: BN;
  currentCycle: number;
  allocationMethod: EnumObject;
  status: EnumObject;
  protocolFeeBps: number;
  totalContributedThisCycle: BN;
  contributionsThisCycle: number;
  currentRecipient: PublicKey;
  voteLeader: PublicKey;
  voteLeaderCount: number;
};

export type MemberData = {
  group: PublicKey;
  wallet: PublicKey;
  cyclesContributed: number;
  lastContributedCycle: number;
  payoutReceived: boolean;
  payoutCycle: number;
  securityDeposit: BN;
  isActive: boolean;
  reputationScore: number;
  reputationClaimed: boolean;
};

type DhukutiProgram = Program & {
  methods: Record<string, (...args: unknown[]) => { accounts: (accounts: Record<string, PublicKey>) => { rpc: () => Promise<string> } }>;
  account: {
    dhukutiGroup: {
      fetch: (address: PublicKey) => Promise<DhukutiGroupData>;
      all: () => Promise<{ publicKey: PublicKey; account: DhukutiGroupData }[]>;
    };
    member: {
      fetch: (address: PublicKey) => Promise<MemberData>;
      all: (filters?: any[]) => Promise<{ publicKey: PublicKey; account: MemberData }[]>;
    };
  };
};

export type CreateGroupInput = {
  contributionSol: number;
  securityDepositSol: number;
  maxMembers: number;
  cycleDays: number;
  allocationMethod: "vote" | "random" | "auction";
  protocolFeeBps: number;
};

export function getEnumKey(obj: EnumObject): string {
  return Object.keys(obj)[0];
}

export function formatStatus(status: EnumObject): string {
  const key = getEnumKey(status);
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function formatAllocation(method: EnumObject): string {
  const key = getEnumKey(method);
  if (key === "vote") return "Janamat vote";
  if (key === "random") return "Random draw";
  return "Auction";
}

export function useDhukuti() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    const anchorProvider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    setProvider(anchorProvider);
    return anchorProvider;
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    const idl = { ...dhukutiIdl, address: DHUKUTI_PROGRAM_ID.toBase58() } as Idl;
    return new Program(idl, provider) as DhukutiProgram;
  }, [provider]);

  const deriveGroup = useCallback((creator: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from("group"), creator.toBuffer()], DHUKUTI_PROGRAM_ID), []);
  const deriveVault = useCallback((group: PublicKey) => PublicKey.findProgramAddressSync([Buffer.from("vault"), group.toBuffer()], DHUKUTI_PROGRAM_ID), []);
  const deriveMember = useCallback((group: PublicKey, member: PublicKey) =>
    PublicKey.findProgramAddressSync([Buffer.from("member"), group.toBuffer(), member.toBuffer()], DHUKUTI_PROGRAM_ID), []);
  const deriveReputation = useCallback((group: PublicKey, member: PublicKey) =>
    PublicKey.findProgramAddressSync([Buffer.from("reputation"), group.toBuffer(), member.toBuffer()], DHUKUTI_PROGRAM_ID), []);

  const getGroup = useCallback(async (address: PublicKey): Promise<DhukutiGroupData | null> => {
    if (!program) return null;
    try {
      return await program.account.dhukutiGroup.fetch(address);
    } catch {
      return null;
    }
  }, [program]);

  const getMember = useCallback(async (address: PublicKey): Promise<MemberData | null> => {
    if (!program) return null;
    try {
      return await program.account.member.fetch(address);
    } catch {
      return null;
    }
  }, [program]);

  const getGroupMembers = useCallback(async (groupAddress: PublicKey): Promise<{ publicKey: PublicKey; account: MemberData }[]> => {
    if (!program) return [];
    try {
      return await program.account.member.all([
        {
          memcmp: {
            offset: 8, // 8-byte discriminator + 32-byte group pubkey
            bytes: groupAddress.toBase58(),
          },
        },
      ]);
    } catch (e) {
      console.error("Error fetching group members:", e);
      return [];
    }
  }, [program]);

  const getUserGroups = useCallback(async (userWallet: PublicKey): Promise<{ publicKey: PublicKey; account: MemberData }[]> => {
    if (!program) return [];
    try {
      return await program.account.member.all([
        {
          memcmp: {
            offset: 40, // 8 (discriminator) + 32 (group pubkey)
            bytes: userWallet.toBase58(),
          },
        },
      ]);
    } catch (e) {
      console.error("Error fetching user groups:", e);
      return [];
    }
  }, [program]);

  async function createGroup(input: CreateGroupInput) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [group] = deriveGroup(wallet.publicKey);
    const [vault] = deriveVault(group);
    const allocationMethod = { [input.allocationMethod]: {} };

    const sig = await program.methods
      .createGroup(
        new BN(input.contributionSol * web3.LAMPORTS_PER_SOL),
        new BN(input.securityDepositSol * web3.LAMPORTS_PER_SOL),
        input.maxMembers,
        new BN(input.cycleDays * 86_400),
        allocationMethod,
        input.protocolFeeBps
      )
      .accounts({
        creator: wallet.publicKey,
        group,
        vault,
        systemProgram: SystemProgram.programId
      })
      .rpc({ commitment: "confirmed" });

    await connection.confirmTransaction(sig, "confirmed");

    return { signature: sig, groupAddress: group };
  }

  async function joinGroup(group: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [member] = deriveMember(group, wallet.publicKey);
    const [vault] = deriveVault(group);

    return program.methods
      .joinGroup()
      .accounts({
        wallet: wallet.publicKey,
        group,
        member,
        vault,
        systemProgram: SystemProgram.programId
      })
      .rpc();
  }

  async function contribute(group: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [member] = deriveMember(group, wallet.publicKey);
    const [vault] = deriveVault(group);

    return program.methods
      .contribute()
      .accounts({
        wallet: wallet.publicKey,
        group,
        member,
        vault,
        systemProgram: SystemProgram.programId
      })
      .rpc();
  }

  async function votePayout(group: PublicKey, nominee: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [voterMember] = deriveMember(group, wallet.publicKey);
    const groupAccount = await program.account.dhukutiGroup.fetch(group);
    const voteRecord = PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), group.toBuffer(), Buffer.from([groupAccount.currentCycle]), wallet.publicKey.toBuffer()],
      DHUKUTI_PROGRAM_ID
    )[0];

    return program.methods
      .votePayout(nominee)
      .accounts({
        voter: wallet.publicKey,
        group,
        voterMember,
        voteRecord,
        systemProgram: SystemProgram.programId
      })
      .rpc();
  }

  async function activateGroup(group: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");

    return program.methods
      .activateGroup()
      .accounts({
        creator: wallet.publicKey,
        group,
      })
      .rpc();
  }

  async function distribute(group: PublicKey, recipient: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [recipientMember] = deriveMember(group, recipient);
    const [vault] = deriveVault(group);

    return program.methods
      .distribute()
      .accounts({
        authority: wallet.publicKey,
        group,
        recipientMember,
        recipient,
        vault,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async function claimReputation(group: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [member] = deriveMember(group, wallet.publicKey);
    const [attestation] = deriveReputation(group, wallet.publicKey);

    return program.methods
      .claimReputation()
      .accounts({
        wallet: wallet.publicKey,
        group,
        member,
        attestation,
        systemProgram: SystemProgram.programId
      })
      .rpc();
  }

  async function withdrawDeposit(group: PublicKey) {
    if (!program || !wallet) throw new Error("Connect a wallet first.");
    const [member] = deriveMember(group, wallet.publicKey);
    const [vault] = deriveVault(group);

    return program.methods
      .withdrawDeposit()
      .accounts({
        wallet: wallet.publicKey,
        group,
        member,
        vault,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  return {
    connected: Boolean(wallet),
    wallet,
    connection,
    program,
    deriveGroup,
    deriveMember,
    deriveVault,
    deriveReputation,
    getGroup,
    getMember,
    getGroupMembers,
    getUserGroups,
    createGroup,
    joinGroup,
    activateGroup,
    contribute,
    distribute,
    votePayout,
    claimReputation,
    withdrawDeposit,
  };
}
