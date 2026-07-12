export type ReputationClaim = {
  minCompletedCycles: number;
  noDefaults: true;
};

export type ReputationProof = {
  publicSignals: ReputationClaim;
  proof: string;
};

export async function buildReputationProof(claim: ReputationClaim): Promise<ReputationProof> {
  return {
    publicSignals: claim,
    proof: "demo-proof-placeholder"
  };
}

export async function verifyReputationProof(proof: ReputationProof): Promise<boolean> {
  return proof.publicSignals.noDefaults && proof.publicSignals.minCompletedCycles > 0 && proof.proof.length > 0;
}
