use anchor_lang::prelude::*;

pub const MAX_MEMBERS: usize = 32;
pub const MAX_FEE_BPS: u16 = 100;
pub const GRACE_PERIOD_SECONDS: i64 = 86_400;

#[account]
pub struct DhukutiGroup {
    pub creator: Pubkey,
    pub vault: Pubkey,
    pub contribution_amount: u64,
    pub security_deposit: u64,
    pub max_members: u8,
    pub current_members: u8,
    pub cycle_period: i64,
    pub cycle_started_at: i64,
    pub current_cycle: u8,
    pub allocation_method: AllocationMethod,
    pub status: GroupStatus,
    pub protocol_fee_bps: u16,
    pub total_contributed_this_cycle: u64,
    pub contributions_this_cycle: u8,
    pub current_recipient: Pubkey,
    pub salt: u64,
    pub vote_nominees: [Pubkey; 32],
    pub vote_counts: [u8; 32],
    pub vote_count: u8,
    pub bump: u8,
    pub vault_bump: u8,
}

impl DhukutiGroup {
    pub const LEN: usize =
        8 + 32 + 32 + 8 + 8 + 1 + 1 + 8 + 8 + 1 + 1 + 1 + 2 + 8 + 1 + 32 + 8 + (32 * 32) + (32 * 1) + 1 + 1 + 1;
}

#[account]
pub struct Member {
    pub group: Pubkey,
    pub wallet: Pubkey,
    pub cycles_contributed: u8,
    pub last_contributed_cycle: u8,
    pub payout_received: bool,
    pub payout_cycle: u8,
    pub security_deposit: u64,
    pub is_active: bool,
    pub reputation_score: u16,
    pub reputation_claimed: bool,
    pub bump: u8,
}

impl Member {
    pub const LEN: usize = 8 + 32 + 32 + 1 + 1 + 1 + 1 + 8 + 1 + 2 + 1 + 1;
}

#[account]
pub struct VoteRecord {
    pub group: Pubkey,
    pub cycle: u8,
    pub voter: Pubkey,
    pub nominee: Pubkey,
    pub bump: u8,
}

impl VoteRecord {
    pub const LEN: usize = 8 + 32 + 1 + 32 + 32 + 1;
}

#[account]
pub struct ReputationAttestation {
    pub member: Pubkey,
    pub wallet: Pubkey,
    pub group: Pubkey,
    pub completed_cycles: u8,
    pub reputation_score: u16,
    pub issued_at: i64,
    pub bump: u8,
}

impl ReputationAttestation {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 1 + 2 + 8 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AllocationMethod {
    Vote,
    Random,
    Auction,
    RoundRobin,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum GroupStatus {
    Forming,
    Active,
    Completed,
    Defaulted,
}
