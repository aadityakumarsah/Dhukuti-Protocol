use anchor_lang::prelude::*;

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus, Member, ReputationAttestation};

#[derive(Accounts)]
pub struct ClaimReputation<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,
    pub group: Box<Account<'info, DhukutiGroup>>,
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), wallet.key().as_ref()],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,
    #[account(
        init,
        payer = wallet,
        space = ReputationAttestation::LEN,
        seeds = [b"reputation", group.key().as_ref(), wallet.key().as_ref()],
        bump
    )]
    pub attestation: Account<'info, ReputationAttestation>,
    pub system_program: Program<'info, System>,
}

pub fn claim_reputation(ctx: Context<ClaimReputation>) -> Result<()> {
    let group = &ctx.accounts.group;
    let member = &mut ctx.accounts.member;

    require!(
        group.status == GroupStatus::Completed,
        DhukutiError::InvalidGroupStatus
    );
    require!(
        !member.reputation_claimed,
        DhukutiError::ReputationAlreadyClaimed
    );
    require!(member.is_active, DhukutiError::InactiveMember);

    let score = (member.cycles_contributed as u16).saturating_mul(100);
    member.reputation_score = score;
    member.reputation_claimed = true;

    let attestation = &mut ctx.accounts.attestation;
    attestation.member = member.key();
    attestation.wallet = ctx.accounts.wallet.key();
    attestation.group = group.key();
    attestation.completed_cycles = member.cycles_contributed;
    attestation.reputation_score = score;
    attestation.issued_at = Clock::get()?.unix_timestamp;
    attestation.bump = ctx.bumps.attestation;

    Ok(())
}
