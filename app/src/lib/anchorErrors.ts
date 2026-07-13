const ERROR_MESSAGES: Record<string, string> = {
  GroupNotReady: "Not all members have joined yet.",
  AlreadyContributed: "You already contributed this cycle.",
  PoolIncomplete: "Not all members have contributed yet.",
  VoteNotWon: "This address hasn't won the vote.",
  PayoutAlreadyReceived: "This member already received a payout.",
  GroupFull: "Group is already full.",
  InvalidGroupStatus: "Wrong group state for this action.",
  InactiveMember: "You are not an active member.",
  InvalidProtocolFee: "Protocol fee is out of range.",
  VoteAlreadyCast: "You already voted this cycle.",
};

export function formatAnchorError(error: unknown): string {
  if (!(error instanceof Error)) return "An unknown error occurred.";

  const msg = error.message;

  if (msg.includes("User rejected") || msg.includes("user rejected") || msg.includes("cancelled")) {
    return "Transaction cancelled.";
  }

  if (msg.includes("429") || msg.includes("rate limit")) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (msg.includes("insufficient lamports")) {
    return "Insufficient SOL balance for this transaction.";
  }

  if (msg.includes("0x1772")) {
    return "Group is full.";
  }

  for (const [code, readable] of Object.entries(ERROR_MESSAGES)) {
    if (msg.includes(code)) return readable;
  }

  const errCodeMatch = msg.match(/Error Code:\s*(\w+)/);
  if (errCodeMatch) {
    return `Transaction failed (${errCodeMatch[1]}).`;
  }

  return "Transaction failed. Check the group state and try again.";
}
