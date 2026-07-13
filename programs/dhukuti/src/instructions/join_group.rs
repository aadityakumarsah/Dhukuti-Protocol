use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus, Member};

#[derive(Accounts)]
pub struct JoinGroup<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,
    #[account(mut)]
    pub group: Box<Account<'info, DhukutiGroup>>,
    #[account(
        init,
        payer = wallet,
        space = Member::LEN,
        seeds = [b"member", group.key().as_ref(), wallet.key().as_ref()],
        bump
    )]
    pub member: Account<'info, Member>,
    /// CHECK: PDA owned by program seeds; lamports only.
    #[account(
        mut,
        seeds = [b"vault", group.key().as_ref()],
        bump = group.vault_bump
    )]
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn join_group(ctx: Context<JoinGroup>) -> Result<()> {
    let group = &mut ctx.accounts.group;
    require!(
        group.status == GroupStatus::Forming,
        DhukutiError::InvalidGroupStatus
    );
    require!(
        group.current_members < group.max_members,
        DhukutiError::GroupFull
    );

    let commitment = group
        .security_deposit
        .checked_add(group.contribution_amount)
        .unwrap();
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.wallet.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        ),
        commitment,
    )?;

    let member = &mut ctx.accounts.member;
    member.group = group.key();
    member.wallet = ctx.accounts.wallet.key();
    member.cycles_contributed = 1;
    member.last_contributed_cycle = 0;
    member.payout_received = false;
    member.payout_cycle = u8::MAX;
    member.security_deposit = group.security_deposit;
    member.is_active = true;
    member.reputation_score = 0;
    member.reputation_claimed = false;
    member.bump = ctx.bumps.member;

    group.current_members += 1;
    group.total_contributed_this_cycle = group
        .total_contributed_this_cycle
        .checked_add(group.contribution_amount)
        .unwrap();
    group.contributions_this_cycle += 1;

    Ok(())
}
