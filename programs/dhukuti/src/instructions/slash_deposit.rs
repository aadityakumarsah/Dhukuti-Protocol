use anchor_lang::prelude::*;

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus, Member, GRACE_PERIOD_SECONDS};

#[derive(Accounts)]
pub struct SlashDeposit<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub group: Box<Account<'info, DhukutiGroup>>,
    #[account(mut)]
    pub defaulter_wallet: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), defaulter_wallet.key().as_ref()],
        bump = defaulter_member.bump
    )]
    pub defaulter_member: Account<'info, Member>,
    /// CHECK: PDA owned by program seeds; lamports only.
    #[account(
        mut,
        seeds = [b"vault", group.key().as_ref()],
        bump = group.vault_bump
    )]
    pub vault: UncheckedAccount<'info>,
    /// CHECK: creator treasury receives slashed SOL in this MVP.
    #[account(mut, address = group.creator)]
    pub treasury: UncheckedAccount<'info>,
}

pub fn slash_deposit(ctx: Context<SlashDeposit>) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let member = &mut ctx.accounts.defaulter_member;

    require!(
        group.status == GroupStatus::Active,
        DhukutiError::InvalidGroupStatus
    );
    require!(member.is_active, DhukutiError::InactiveMember);
    require!(
        Clock::get()?.unix_timestamp
            > group.cycle_started_at + group.cycle_period + GRACE_PERIOD_SECONDS,
        DhukutiError::GracePeriodActive
    );
    require!(
        member.last_contributed_cycle != group.current_cycle,
        DhukutiError::AlreadyContributed
    );

    let slash_amount = member.security_deposit;
    **ctx
        .accounts
        .vault
        .to_account_info()
        .try_borrow_mut_lamports()? -= slash_amount;
    **ctx
        .accounts
        .treasury
        .to_account_info()
        .try_borrow_mut_lamports()? += slash_amount;

    member.security_deposit = 0;
    member.is_active = false;
    group.status = GroupStatus::Defaulted;

    Ok(())
}
