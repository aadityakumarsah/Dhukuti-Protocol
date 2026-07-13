"use client";

import { Vote } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { useDhukuti } from "@/hooks/useDhukuti";
import { formatAnchorError } from "@/lib/anchorErrors";

type Props = {
  groupAddress?: PublicKey | null;
};

export function VotingPanel({ groupAddress }: Props) {
  const { votePayout, connected } = useDhukuti();
  const [status, setStatus] = useState("");
  const [groupInput, setGroupInput] = useState("");

  useEffect(() => {
    if (groupAddress) {
      setGroupInput(groupAddress.toBase58());
    }
  }, [groupAddress]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const groupRaw = form.get("group") as string;
    const nomineeRaw = form.get("nominee") as string;

    if (!groupRaw.trim() || !nomineeRaw.trim()) {
      setStatus("Enter both group address and nominee.");
      return;
    }

    let group: PublicKey;
    let nominee: PublicKey;
    try {
      group = new PublicKey(groupRaw.trim());
      nominee = new PublicKey(nomineeRaw.trim());
    } catch {
      setStatus("Invalid public key format.");
      return;
    }

    setStatus("Submitting vote...");

    try {
      const signature = await votePayout(group, nominee);
      setStatus(`Voted: ${signature.slice(0, 10)}...`);
    } catch (error) {
      toast.error(formatAnchorError(error));
      setStatus("");
    }
  }

  return (
    <form className="panel medium" onSubmit={onSubmit}>
      <h3>Janamat Vote</h3>
      <label>
        Group address
        <input
          name="group"
          placeholder="Paste group PDA"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
        />
      </label>
      <label>
        Payout nominee
        <input name="nominee" placeholder="Wallet public key" />
      </label>
      <div className="button-row">
        <button className="primary-button" disabled={!connected} type="submit">
          <Vote size={18} />
          Vote
        </button>
      </div>
      {status ? <p className="warning">{status}</p> : null}
    </form>
  );
}
