use anchor_lang::prelude::*;

use crate::errors::DhukutiError;
use crate::state::{DhukutiGroup, GroupStatus};

#[derive(Accounts)]
pub struct ActivateGroup<'info> {
    pub creator: Signer<'info>,
    #[account(mut, has_one = creator)]
    pub group: Account<'info, DhukutiGroup>,
}

pub fn activate_group(ctx: Context<ActivateGroup>) -> Result<()> {
    let group = &mut ctx.accounts.group;
    require!(
        group.status == GroupStatus::Forming,
        DhukutiError::InvalidGroupStatus
    );
    require!(
        group.current_members == group.max_members,
        DhukutiError::GroupNotReady
    );

    group.status = GroupStatus::Active;
    group.cycle_started_at = Clock::get()?.unix_timestamp;

    Ok(())
}
