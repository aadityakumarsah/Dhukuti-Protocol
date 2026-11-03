import { PublicKey } from "@solana/web3.js";

export const DHUKUTI_PROGRAM_ID = new PublicKey("egyrA1EJRsr2b7QbciVXX78U3TkPy8GQ9dTDJQHPHvo");

/** Encodes a u64 salt as 8 little-endian bytes, matching `salt.to_le_bytes()` in the program. */
export function saltSeed(salt: bigint | number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(salt));
  return buf;
}

/** Group PDA: ["group", creator, salt_le_u64]. One creator can run many groups by varying the salt. */
export function deriveGroupAddress(creator: PublicKey, salt: bigint | number, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("group"), creator.toBuffer(), saltSeed(salt)], programId);
}

export function deriveVaultAddress(group: PublicKey, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("vault"), group.toBuffer()], programId);
}

export function deriveMemberAddress(group: PublicKey, wallet: PublicKey, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("member"), group.toBuffer(), wallet.toBuffer()], programId);
}

export function deriveVoteAddress(group: PublicKey, cycle: number, voter: PublicKey, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("vote"), group.toBuffer(), Buffer.from([cycle]), voter.toBuffer()], programId);
}

export function deriveReputationAddress(group: PublicKey, wallet: PublicKey, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("reputation"), group.toBuffer(), wallet.toBuffer()], programId);
}
