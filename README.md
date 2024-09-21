# D-Trust

Decentralizing the Truth to Combat Censorship and Misinformation

## Why?

In an era where misinformation spreads faster than facts and censorship stifles diverse voices, the truth has become a contested commodity. Traditional fact-checking mechanisms are often centralized, vulnerable to biases, and limited by geopolitical or financial influences. But what if there was a way to democratize the process of fact-checking, putting the power back into the hands of the people? Enter D-Trust—a decentralized platform leveraging blockchain technology to create a transparent, censorship-resistant environment for validating real-world events and information.

The Problem: Centralized Truth in a Decentralized World

Misinformation and censorship are not just buzzwords; they are critical issues undermining trust in media, governance, and even science. Platforms that control the flow of information can manipulate narratives, suppress dissenting voices, and prioritize profit over the public good. As a result, the public's ability to discern truth from falsehood diminishes, leading to polarized societies and misinformed decisions.

Traditional fact-checking organizations, while essential, often face questions about their impartiality and reach. Their centralized nature makes them susceptible to external pressures and biases, further complicating the quest for a universally accepted truth. The need for a decentralized solution has never been more urgent.

## How D-Trust Works: Trustless Verification, Collective Accountability

1. Claim submissons with bounties
2. Decentralized Voting
3. Proof Validation
4. Outcome and Incentives

### Architecture

![alt text](architecture.jpg)

### Tech Stack used

1. World Coin - To verify uniquness & humanness for fair voting

2. RootStock - To Deploy the verification game smart contract
   Contracts Deployed:
   D-Trust : 0xFe9c4fA65f3A0Da7Ac2D399F52E77a67ac5a244E
   D-TrustToken: 0x870d1d8665588513afFe26B446385ffa4ec8eeC2
3. Scaffold Eth - To bootstrap a full Stack DApp
4. Sign Protocol - To create omnichain attestations for Validator flow
   Hook Contract: 0x0Fb484F2057e224D5f025B4bD5926669a5a32786
   Schema Link: https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x261
5. IPFS - To store data in a decentralized fashion

## Instructions

1. Sign-in using WorldCoin App to start voting on the platform & earn bounties

2) Create a new Bounty to get any facts verifed.

3) request refund of bounties whose threshold for successful verification is not reached

### contracts

```
yarn deploy
```

### frontend

```
   cp .env.sample .env`
   cd packages/nextjs
   yarn
   yarn start
```

## Future steps

1. Integrate

## Demo
