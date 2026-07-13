use anchor_lang::prelude::*;

use crate::errors::DhukutiError;
use crate::state::{AllocationMethod, DhukutiGroup, GroupStatus, Member, VoteRecord};

#[derive(Accounts)]
pub struct VotePayout<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(mut)]
    pub group: Box<Account<'info, DhukutiGroup>>,
    #[account(
        seeds = [b"member", group.key().as_ref(), voter.key().as_ref()],
        bump = voter_member.bump
    )]
    pub voter_member: Account<'info, Member>,
    #[account(
        init,
        payer = voter,
        space = VoteRecord::LEN,
        seeds = [b"vote", group.key().as_ref(), &[group.current_cycle], voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    pub system_program: Program<'info, System>,
}

pub fn vote_payout(ctx: Context<VotePayout>, nominee: Pubkey) -> Result<()> {
    let group = &mut ctx.accounts.group;
    require!(
        group.status == GroupStatus::Active,
        DhukutiError::InvalidGroupStatus
    );
    require!(
        group.allocation_method == AllocationMethod::Vote,
        DhukutiError::InvalidAllocationMethod
    );
    require!(
        ctx.accounts.voter_member.is_active,
        DhukutiError::InactiveMember
    );
    require!(
        ctx.accounts.voter.key() != nominee,
        DhukutiError::CannotSelfVote
    );

    let vote_record = &mut ctx.accounts.vote_record;
    vote_record.group = group.key();
    vote_record.cycle = group.current_cycle;
    vote_record.voter = ctx.accounts.voter.key();
    vote_record.nominee = nominee;
    vote_record.bump = ctx.bumps.vote_record;

    let mut found = false;
    for i in 0..group.vote_count as usize {
        if group.vote_nominees[i] == nominee {
            group.vote_counts[i] = group.vote_counts[i].saturating_add(1);
            found = true;
            break;
        }
    }
    if !found {
        let idx = group.vote_count as usize;
        group.vote_nominees[idx] = nominee;
        group.vote_counts[idx] = 1;
        group.vote_count += 1;
    }

    Ok(())
}
