use anchor_lang::prelude::*;

#[error_code]
pub enum DhukutiError {
    #[msg("The group has reached its member limit.")]
    GroupFull,
    #[msg("The group is not in the required state for this action.")]
    InvalidGroupStatus,
    #[msg("The group is not ready to activate.")]
    GroupNotReady,
    #[msg("This member has already contributed for the current cycle.")]
    AlreadyContributed,
    #[msg("This member is not active.")]
    InactiveMember,
    #[msg("The contribution pool is not complete yet.")]
    PoolIncomplete,
    #[msg("This member has already received a payout.")]
    PayoutAlreadyReceived,
    #[msg("The selected payout recipient has not won the current vote.")]
    VoteNotWon,
    #[msg("The current cycle is still inside its grace period.")]
    GracePeriodActive,
    #[msg("This member already claimed completion reputation.")]
    ReputationAlreadyClaimed,
    #[msg("Invalid protocol fee.")]
    InvalidProtocolFee,
    #[msg("Deposit already withdrawn.")]
    DepositAlreadyWithdrawn,
}
