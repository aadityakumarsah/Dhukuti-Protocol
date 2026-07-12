use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus, Member};

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,
    #[account(mut)]
    pub group: Account<'info, DhukutiGroup>,
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

pub fn contribute(ctx: Context<Contribute>) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let member = &mut ctx.accounts.member;

    require!(
        group.status == GroupStatus::Active,
        DhukutiError::InvalidGroupStatus
    );
    require!(member.is_active, DhukutiError::InactiveMember);
    require!(
        member.last_contributed_cycle != group.current_cycle,
        DhukutiError::AlreadyContributed
    );

    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.wallet.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        ),
        group.contribution_amount,
    )?;

    member.last_contributed_cycle = group.current_cycle;
    member.cycles_contributed = member.cycles_contributed.saturating_add(1);
    group.total_contributed_this_cycle = group
        .total_contributed_this_cycle
        .checked_add(group.contribution_amount)
        .unwrap();
    group.contributions_this_cycle += 1;

    Ok(())
}
