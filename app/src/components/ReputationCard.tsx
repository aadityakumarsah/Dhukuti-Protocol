"use client";

import { BadgeCheck } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

export function ReputationCard() {
  const { claimReputation, connected } = useDhukuti();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Claiming attestation...");
    try {
      const group = new PublicKey(String(new FormData(event.currentTarget).get("group")));
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
        <input name="group" placeholder="Paste group PDA" />
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
