// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the OpenZeppelin ERC20 contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Defining the token contract
contract DtrustToken is ERC20 {

    // Constructor that mints 1 million tokens to the deployer
    constructor() ERC20("D-Trust", "DST") {
        // Mint 1 million tokens to the deployer (1,000,000 * 10^18)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
