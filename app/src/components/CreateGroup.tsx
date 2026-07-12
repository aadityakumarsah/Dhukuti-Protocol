"use client";

import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";

import { useDhukuti } from "@/hooks/useDhukuti";

export function CreateGroup() {
  const { createGroup, connected } = useDhukuti();
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("Creating group...");

    try {
      const signature = await createGroup({
        contributionSol: Number(form.get("contributionSol")),
        securityDepositSol: Number(form.get("securityDepositSol")),
        maxMembers: Number(form.get("maxMembers")),
        cycleDays: Number(form.get("cycleDays")),
        allocationMethod: String(form.get("allocationMethod")) as "vote" | "random" | "auction",
        protocolFeeBps: Number(form.get("protocolFeeBps"))
      });
      setStatus(`Created: ${signature.slice(0, 10)}...`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create group.");
    }
  }

  return (
    <form className="panel large" onSubmit={onSubmit}>
      <h3>Create Dhukuti Group</h3>
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
      </div>
      {status ? <p className="warning">{status}</p> : null}
    </form>
  );
}
