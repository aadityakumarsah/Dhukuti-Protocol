use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus, Member};

#[derive(Accounts)]
pub struct WithdrawDeposit<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,
    #[account(
        mut,
        seeds = [b"group", group.creator.as_ref()],
        bump = group.bump
    )]
    pub group: Box<Account<'info, DhukutiGroup>>,
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), wallet.key().as_ref()],
        bump = member.bump
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

pub fn withdraw_deposit(ctx: Context<WithdrawDeposit>) -> Result<()> {
    let group = &ctx.accounts.group;
    let member = &mut ctx.accounts.member;

    require!(
        group.status == GroupStatus::Completed,
        DhukutiError::InvalidGroupStatus
    );
    require!(member.is_active, DhukutiError::InactiveMember);
    require!(
        member.security_deposit > 0,
        DhukutiError::DepositAlreadyWithdrawn
    );

    let deposit = member.security_deposit;
    member.security_deposit = 0;

    let group_key = group.key();
    let vault_seeds = &[b"vault", group_key.as_ref(), &[group.vault_bump]];
    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.wallet.to_account_info(),
            },
            &[vault_seeds],
        ),
        deposit,
    )?;

    Ok(())
}
