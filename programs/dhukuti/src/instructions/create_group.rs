use anchor_lang::prelude::*;

use crate::errors::DhukutiError;
use crate::state::{AllocationMethod, DhukutiGroup, GroupStatus, MAX_FEE_BPS, MAX_MEMBERS};

#[derive(Accounts)]
#[instruction(
    contribution_amount: u64,
    security_deposit: u64,
    max_members: u8,
    cycle_period: i64,
    allocation_method: AllocationMethod,
    protocol_fee_bps: u16
)]
pub struct CreateGroup<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = DhukutiGroup::LEN,
        seeds = [b"group", creator.key().as_ref()],
        bump
    )]
    pub group: Account<'info, DhukutiGroup>,
    /// CHECK: PDA that only receives and sends lamports through this program.
    #[account(
        mut,
        seeds = [b"vault", group.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_group(
    ctx: Context<CreateGroup>,
    contribution_amount: u64,
    security_deposit: u64,
    max_members: u8,
    cycle_period: i64,
    allocation_method: AllocationMethod,
    protocol_fee_bps: u16,
) -> Result<()> {
    require!(
        max_members > 1 && max_members as usize <= MAX_MEMBERS,
        DhukutiError::GroupFull
    );
    require!(
        protocol_fee_bps <= MAX_FEE_BPS,
        DhukutiError::InvalidProtocolFee
    );

    let group = &mut ctx.accounts.group;
    group.creator = ctx.accounts.creator.key();
    group.vault = ctx.accounts.vault.key();
    group.contribution_amount = contribution_amount;
    group.security_deposit = security_deposit;
    group.max_members = max_members;
    group.current_members = 0;
    group.cycle_period = cycle_period;
    group.cycle_started_at = 0;
    group.current_cycle = 0;
    group.allocation_method = allocation_method;
    group.status = GroupStatus::Forming;
    group.protocol_fee_bps = protocol_fee_bps;
    group.total_contributed_this_cycle = 0;
    group.contributions_this_cycle = 0;
    group.current_recipient = Pubkey::default();
    group.vote_leader = Pubkey::default();
    group.vote_leader_count = 0;
    group.bump = ctx.bumps.group;
    group.vault_bump = ctx.bumps.vault;

    Ok(())
}
