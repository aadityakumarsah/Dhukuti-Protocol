"use client";

import { HandCoins } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useEffect, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

type Props = {
  groupAddress?: PublicKey | null;
  onGroupSelected?: (address: PublicKey) => void;
};

export function ContributionPanel({ groupAddress, onGroupSelected }: Props) {
  const { contribute, joinGroup, connected } = useDhukuti();
  const [status, setStatus] = useState("");
  const [groupInput, setGroupInput] = useState("");

  useEffect(() => {
    if (groupAddress) {
      setGroupInput(groupAddress.toBase58());
    }
  }, [groupAddress]);

  async function submitForm(form: HTMLFormElement, action: "join" | "contribute") {
    const raw = new FormData(form).get("group") as string;
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
    setStatus(action === "join" ? "Joining group..." : "Sending contribution...");

    try {
      const signature = action === "join" ? await joinGroup(group) : await contribute(group);
      setStatus(`Confirmed: ${signature.slice(0, 10)}...`);
      onGroupSelected?.(group);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Transaction failed.");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitForm(event.currentTarget, "contribute");
  }

  return (
    <form className="panel medium" onSubmit={onSubmit}>
      <h3>Contribution</h3>
      <label>
        Group address
        <input
          name="group"
          placeholder="Paste group PDA"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
        />
      </label>
      <div className="button-row">
        <button
          className="secondary-button"
          disabled={!connected}
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) void submitForm(form, "join");
          }}
          type="button"
        >
          Join
        </button>
        <button className="primary-button" disabled={!connected} type="submit">
          <HandCoins size={18} />
          Contribute
        </button>
      </div>
      {status ? <p className="warning">{status}</p> : null}
    </form>
  );
}
