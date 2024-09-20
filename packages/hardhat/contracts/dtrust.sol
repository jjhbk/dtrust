// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
	function transferFrom(
		address sender,
		address recipient,
		uint256 amount
	) external returns (bool);

	function transfer(
		address recipient,
		uint256 amount
	) external returns (bool);
}

contract FactCheckBounty {
	struct Vote {
		bool vote; // True or false vote
		string proof; // Proof link or file hash
	}

	struct Bounty {
		address creator;
		IERC20 token;
		uint256 amount;
		uint256 trueVotes;
		uint256 falseVotes;
		uint256 voteThreshold;
		uint256 deadline;
		bool isCompleted;
		bool finalOutcome; // True for true votes winning, false for false votes winning
		mapping(address => bool) hasVoted;
		mapping(address => Vote) votes;
		mapping(bool => address[]) votersList;
	}

	mapping(uint256 => Bounty) public bounties;
	uint256 public bountyCounter;

	event BountyCreated(
		uint256 indexed bountyId,
		address indexed creator,
		uint256 amount,
		uint256 voteThreshold,
		uint256 deadline
	);
	event Voted(
		uint256 indexed bountyId,
		address indexed voter,
		bool vote,
		string proof
	);
	event BountyCompleted(uint256 indexed bountyId, bool outcome);
	event BountyRefunded(uint256 indexed bountyId);

	function createBounty(
		IERC20 _token,
		uint256 _amount,
		uint256 _voteThreshold,
		uint256 _duration
	) external {
		require(_amount > 0, "Amount must be greater than zero");
		require(_voteThreshold > 0, "Vote threshold must be greater than zero");
		require(_duration > 0, "Duration must be greater than zero");

		// Transfer the ERC20 tokens to the contract as the bounty escrow
		require(
			_token.transferFrom(msg.sender, address(this), _amount),
			"Token transfer failed"
		);

		bountyCounter++;
		Bounty storage newBounty = bounties[bountyCounter];
		newBounty.creator = msg.sender;
		newBounty.token = _token;
		newBounty.amount = _amount;
		newBounty.voteThreshold = _voteThreshold;
		newBounty.deadline = block.timestamp + _duration;

		emit BountyCreated(
			bountyCounter,
			msg.sender,
			_amount,
			_voteThreshold,
			newBounty.deadline
		);
	}

	function vote(
		uint256 _bountyId,
		bool _vote,
		string calldata _proof
	) external {
		Bounty storage bounty = bounties[_bountyId];
		require(block.timestamp < bounty.deadline, "Voting period has ended");
		require(!bounty.isCompleted, "Bounty already completed");
		require(!bounty.hasVoted[msg.sender], "You have already voted");
		require(bytes(_proof).length > 0, "Proof must be provided");

		bounty.hasVoted[msg.sender] = true;
		bounty.votes[msg.sender] = Vote({ vote: _vote, proof: _proof });
		bounty.votersList[_vote].push(msg.sender);

		if (_vote) {
			bounty.trueVotes++;
		} else {
			bounty.falseVotes++;
		}

		emit Voted(_bountyId, msg.sender, _vote, _proof);

		// Check if either true or false votes reach the threshold
		if (bounty.trueVotes >= bounty.voteThreshold) {
			completeBounty(_bountyId, true);
		} else if (bounty.falseVotes >= bounty.voteThreshold) {
			completeBounty(_bountyId, false);
		}
	}

	function completeBounty(uint256 _bountyId, bool outcome) internal {
		Bounty storage bounty = bounties[_bountyId];
		require(!bounty.isCompleted, "Bounty already completed");
		bounty.isCompleted = true;
		bounty.finalOutcome = outcome;

		// Determine winners and split bounty among them based on the final outcome
		address[] storage winners = bounty.votersList[outcome];
		uint256 reward = winners.length > 0
			? bounty.amount / winners.length
			: 0;

		for (uint256 i = 0; i < winners.length; i++) {
			bounty.token.transfer(winners[i], reward);
		}

		emit BountyCompleted(_bountyId, outcome);
	}

	function refundBounty(uint256 _bountyId) external {
		Bounty storage bounty = bounties[_bountyId];
		require(
			block.timestamp > bounty.deadline,
			"Voting period has not ended"
		);
		require(!bounty.isCompleted, "Bounty already completed");
		require(
			bounty.trueVotes < bounty.voteThreshold &&
				bounty.falseVotes < bounty.voteThreshold,
			"Vote threshold reached"
		);

		bounty.isCompleted = true;
		bounty.token.transfer(bounty.creator, bounty.amount);

		emit BountyRefunded(_bountyId);
	}

	function getVoterProof(
		uint256 _bountyId,
		address _voter
	) external view returns (Vote memory) {
		Bounty storage bounty = bounties[_bountyId];
		require(bounty.hasVoted[_voter], "Voter has not voted on this bounty");
		return bounty.votes[_voter];
	}

	function getVoters(
		uint256 _bountyId,
		bool _vote
	) external view returns (address[] memory) {
		return bounties[_bountyId].votersList[_vote];
	}
}
