// Generates Solana keypairs for deployment.
// Run: node scripts/generate-keypair.mjs
// You need @solana/web3.js installed in the app directory.

import { Keypair } from "../app/node_modules/@solana/web3.js";

const deployer = Keypair.generate();
const program = Keypair.generate();

console.log("\n=== ADD TO GITHUB SECRETS ===");

console.log("\nSecret name: DEPLOYER_KEYPAIR");
console.log("Value:");
console.log(JSON.stringify(Array.from(deployer.secretKey)));

console.log("\nSecret name: PROGRAM_KEYPAIR");
console.log("Value:");
console.log(JSON.stringify(Array.from(program.secretKey)));

console.log("\n=== FUND THIS ADDRESS WITH DEVNET SOL ===");
console.log("https://faucet.solana.com/");
console.log("Address:", deployer.publicKey.toBase58());

console.log("\n=== SET THIS AS VERCEL ENV VAR ===");
console.log("NEXT_PUBLIC_DHUKUTI_PROGRAM_ID =", program.publicKey.toBase58());

console.log("\n=== UPDATE THESE FILES WITH THE PROGRAM ID ===");
console.log("Anchor.toml       -> [programs.localnet] dhukuti =", `"${program.publicKey.toBase58()}"`);
console.log("programs/dhukuti/src/lib.rs -> declare_id!(\"${program.publicKey.toBase58()}\");");
console.log("app/.env.local    -> NEXT_PUBLIC_DHUKUTI_PROGRAM_ID=" + program.publicKey.toBase58());
