use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::DhukutiError;
use crate::state::{AllocationMethod, DhukutiGroup, GroupStatus, Member};

#[derive(Accounts)]
pub struct Distribute<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub group: Account<'info, DhukutiGroup>,
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), recipient.key().as_ref()],
        bump = recipient_member.bump
    )]
    pub recipient_member: Account<'info, Member>,
    /// CHECK: recipient wallet receives SOL from the vault.
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,
    /// CHECK: PDA owned by program seeds; lamports only.
    #[account(
        mut,
        seeds = [b"vault", group.key().as_ref()],
        bump = group.vault_bump
    )]
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn distribute(ctx: Context<Distribute>) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let recipient_member = &mut ctx.accounts.recipient_member;

    require!(
        group.status == GroupStatus::Active,
        DhukutiError::InvalidGroupStatus
    );
    require!(
        group.contributions_this_cycle == group.current_members,
        DhukutiError::PoolIncomplete
    );
    require!(
        !recipient_member.payout_received,
        DhukutiError::PayoutAlreadyReceived
    );

    if group.allocation_method == AllocationMethod::Vote {
        require!(
            group.vote_leader == ctx.accounts.recipient.key(),
            DhukutiError::VoteNotWon
        );
    }

    let gross_pool = group
        .contribution_amount
        .checked_mul(group.current_members as u64)
        .unwrap();
    let fee = gross_pool
        .checked_mul(group.protocol_fee_bps as u64)
        .unwrap()
        .checked_div(10_000)
        .unwrap();
    let payout = gross_pool.checked_sub(fee).unwrap();

    let group_key = group.key();
    let vault_seeds = &[b"vault", group_key.as_ref(), &[group.vault_bump]];
    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
            &[vault_seeds],
        ),
        payout,
    )?;

    recipient_member.payout_received = true;
    recipient_member.payout_cycle = group.current_cycle;
    group.current_recipient = ctx.accounts.recipient.key();
    group.current_cycle += 1;
    group.total_contributed_this_cycle = 0;
    group.contributions_this_cycle = 0;
    group.vote_leader = Pubkey::default();
    group.vote_leader_count = 0;
    group.cycle_started_at = Clock::get()?.unix_timestamp;

    if group.current_cycle == group.max_members {
        group.status = GroupStatus::Completed;
    }

    Ok(())
}
