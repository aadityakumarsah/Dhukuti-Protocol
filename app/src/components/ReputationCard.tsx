"use client";

import { BadgeCheck, ArrowLeftFromLine } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { useDhukuti } from "@/hooks/useDhukuti";
import { formatAnchorError } from "@/lib/anchorErrors";

type Props = {
  groupAddress?: PublicKey | null;
};

export function ReputationCard({ groupAddress }: Props) {
  const { claimReputation, withdrawDeposit, connected } = useDhukuti();
  const [status, setStatus] = useState("");
  const [depositStatus, setDepositStatus] = useState("");
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
      toast.error(formatAnchorError(error));
      setStatus("");
    }
  }

  async function handleWithdraw() {
    if (!groupAddress) return;
    setDepositStatus("Withdrawing deposit...");
    try {
      const sig = await withdrawDeposit(groupAddress);
      setDepositStatus(`Deposit returned: ${sig.slice(0, 10)}...`);
      toast.success("Security deposit returned to your wallet!");
    } catch (error) {
      toast.error(formatAnchorError(error));
      setDepositStatus("");
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
        {groupAddress && (
          <button className="secondary-button" type="button" disabled={!connected} onClick={handleWithdraw}>
            <ArrowLeftFromLine size={18} />
            Withdraw Deposit
          </button>
        )}
      </div>
      {status ? <p className="warning">{status}</p> : null}
      {depositStatus ? <p className="warning">{depositStatus}</p> : null}
    </form>
  );
}
