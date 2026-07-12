"use client";

import { Plus, Copy } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

type Props = {
  onGroupCreated?: (address: PublicKey) => void;
};

export function CreateGroup({ onGroupCreated }: Props) {
  const { createGroup, deriveGroup, connected, wallet } = useDhukuti();
  const [status, setStatus] = useState("");
  const [createdGroup, setCreatedGroup] = useState<PublicKey | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Creating group...");
    setCreatedGroup(null);

    try {
      const { signature, groupAddress } = await createGroup({
        contributionSol: Number(form.get("contributionSol")),
        securityDepositSol: Number(form.get("securityDepositSol")),
        maxMembers: Number(form.get("maxMembers")),
        cycleDays: Number(form.get("cycleDays")),
        allocationMethod: String(form.get("allocationMethod")) as "vote" | "random" | "auction",
        protocolFeeBps: Number(form.get("protocolFeeBps"))
      });
      setStatus(`Created: ${signature.slice(0, 10)}...`);
      setCreatedGroup(groupAddress);
      onGroupCreated?.(groupAddress);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create group.");
    }
  }

  async function handleCopy() {
    if (!createdGroup) return;
    await navigator.clipboard.writeText(createdGroup.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const existingGroup = wallet ? deriveGroup(wallet.publicKey)[0] : null;

  return (
    <form className="panel large" onSubmit={onSubmit}>
      <h3>Create Dhukuti Group</h3>
      {existingGroup && connected && (
        <p className="muted" style={{ marginBottom: 12, fontSize: "0.82rem" }}>
          Your group PDA: {existingGroup.toBase58().slice(0, 16)}...
        </p>
      )}
      <div className="field-grid">
        <label>
          Contribution SOL
          <input name="contributionSol" type="number" min="0.001" step="0.001" defaultValue="0.05" />
        </label>
        <label>
          Security Deposit SOL
          <input name="securityDepositSol" type="number" min="0.001" step="0.001" defaultValue="0.02" />
        </label>
        <label>
          Members
          <input name="maxMembers" type="number" min="2" max="32" defaultValue="5" />
        </label>
        <label>
          Cycle Days
          <input name="cycleDays" type="number" min="1" defaultValue="30" />
        </label>
        <label>
          Allocation
          <select name="allocationMethod" defaultValue="vote">
            <option value="vote">Janamat vote</option>
            <option value="random">Random draw</option>
            <option value="auction">Auction</option>
          </select>
        </label>
        <label>
          Protocol Fee BPS
          <input name="protocolFeeBps" type="number" min="0" max="100" defaultValue="50" />
        </label>
      </div>
      <div className="button-row">
        <button className="primary-button" type="submit" disabled={!connected}>
          <Plus size={18} />
          Create
        </button>
        {createdGroup && (
          <button className="secondary-button" type="button" onClick={handleCopy}>
            <Copy size={17} />
            {copied ? "Copied!" : "Copy group address"}
          </button>
        )}
      </div>
      {status ? <p className={createdGroup ? "" : "warning"}>{status}</p> : null}
      {createdGroup && (
        <p style={{ fontSize: "0.78rem", marginTop: 8, wordBreak: "break-all", color: "var(--muted)" }}>
          Group: {createdGroup.toBase58()}
        </p>
      )}
    </form>
  );
}
