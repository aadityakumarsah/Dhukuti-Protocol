import { PublicKey } from "@solana/web3.js";

export const DHUKUTI_PROGRAM_ID = new PublicKey("3XxJ1AQGdvUKbSwksUKoew5xDZK1p7q48vvBhQejBHHt");

export function deriveGroupAddress(creator: PublicKey, programId = DHUKUTI_PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("group"), creator.toBuffer()], programId);
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
