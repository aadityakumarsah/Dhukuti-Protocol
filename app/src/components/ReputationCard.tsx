"use client";

import { BadgeCheck } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useEffect, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

type Props = {
  groupAddress?: PublicKey | null;
};

export function ReputationCard({ groupAddress }: Props) {
  const { claimReputation, connected } = useDhukuti();
  const [status, setStatus] = useState("");
  const [groupInput, setGroupInput] = useState("");

  useEffect(() => {
    if (groupAddress) {
      setGroupInput(groupAddress.toBase58());
    }
  }, [groupAddress]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = new FormData(event.currentTarget).get("group") as string;
    if (!raw.trim()) {
      setStatus("Enter a group address.");
      return;
    }
    let group: PublicKey;
    try {
      group = new PublicKey(raw.trim());
    } catch {
      setStatus("Invalid group address.");
      return;
    }
    setStatus("Claiming attestation...");
    try {
      const signature = await claimReputation(group);
      setStatus(`Attested: ${signature.slice(0, 10)}...`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Claim failed.");
    }
  }

  return (
    <form className="panel medium" onSubmit={onSubmit}>
      <h3>Reputation</h3>
      <div className="data-list">
        <div className="data-row">
          <span>Completed cycles</span>
          <strong>0</strong>
        </div>
        <div className="data-row">
          <span>Score</span>
          <strong>Pending</strong>
        </div>
      </div>
      <label>
        Completed group
        <input
          name="group"
          placeholder="Paste group PDA"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
        />
      </label>
      <div className="button-row">
        <button className="primary-button" disabled={!connected} type="submit">
          <BadgeCheck size={18} />
          Claim
        </button>
      </div>
      {status ? <p className="warning">{status}</p> : null}
    </form>
  );
}
