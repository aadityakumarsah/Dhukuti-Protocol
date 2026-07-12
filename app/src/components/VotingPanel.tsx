"use client";

import { Vote } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

export function VotingPanel() {
  const { votePayout, connected } = useDhukuti();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Submitting vote...");

    try {
      const signature = await votePayout(new PublicKey(String(form.get("group"))), new PublicKey(String(form.get("nominee"))));
      setStatus(`Voted: ${signature.slice(0, 10)}...`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Vote failed.");
    }
  }

  return (
    <form className="panel medium" onSubmit={onSubmit}>
      <h3>Janamat Vote</h3>
      <label>
        Group address
        <input name="group" placeholder="Paste group PDA" />
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
