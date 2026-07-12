use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("3XxJ1AQGdvUKbSwksUKoew5xDZK1p7q48vvBhQejBHHt");

#[program]
pub mod dhukuti {
    use super::*;

    pub fn create_group(
        ctx: Context<CreateGroup>,
        contribution_amount: u64,
        security_deposit: u64,
        max_members: u8,
        cycle_period: i64,
        allocation_method: state::AllocationMethod,
        protocol_fee_bps: u16,
    ) -> Result<()> {
        instructions::create_group(
            ctx,
            contribution_amount,
            security_deposit,
            max_members,
            cycle_period,
            allocation_method,
            protocol_fee_bps,
        )
    }

    pub fn join_group(ctx: Context<JoinGroup>) -> Result<()> {
        instructions::join_group(ctx)
    }

    pub fn activate_group(ctx: Context<ActivateGroup>) -> Result<()> {
        instructions::activate_group(ctx)
    }

    pub fn contribute(ctx: Context<Contribute>) -> Result<()> {
        instructions::contribute(ctx)
    }

    pub fn vote_payout(ctx: Context<VotePayout>, nominee: Pubkey) -> Result<()> {
        instructions::vote_payout(ctx, nominee)
    }

    pub fn distribute(ctx: Context<Distribute>) -> Result<()> {
        instructions::distribute(ctx)
    }

    pub fn claim_reputation(ctx: Context<ClaimReputation>) -> Result<()> {
        instructions::claim_reputation(ctx)
    }

    pub fn slash_deposit(ctx: Context<SlashDeposit>) -> Result<()> {
        instructions::slash_deposit(ctx)
    }
}
