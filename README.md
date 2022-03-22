# Starter Labs - CHALLENGE

## Description

Create an ERC20 Token with 1,000,000,000 supply and an NFT ERC721 Token (compatible with OpenSea standard).
Create a minting html page where the user can connect with Metamask, mint a random monster (of these five available monsters) with a random power level between 1 and 100. The cost for minting a monster is 15 Tokens.<br>
The page should list all of the prior minted monster images and power level of the connected user wallet.
The contracts should be deployed to Mumbai Testnet and use the ChainLink VRF for a secure random generation.

## How to run

1. Compile both projects smart contracts and web with command:<br>
   `npm i`
2. Test the smart contracts in folder smart_contracts with command:<br>
   `npx hardhat test`
3. Update the configuration making a copy of .env.example to .env
4. Deploy the smart contracts with command:<br>
   `npx hardhat run scripts/deploy.ts --network mumbai`
5. Copy the token, nft and random generator addresses to `starter-web/src/configs/smartContractAddress.ts`
6. Run script to copy the abis to `starter-web/src/contracts/` with command: `npm run cp-contracts`
7. Run web version in starter-web with command: `npm run dev`

## How to verify deployed contracts

`npx hardhat verify TOKEN_ADDRESS --contract contracts/SlabsToken.sol:SlabsToken --network mumbai`

`npx hardhat verify RANDOM_NUMBER_ADDRESS --network mumbai`

`npx hardhat verify --network mumbai NFT_ADDRESS "TOKEN_ADDRESS" "RANDOM_NUMBER_ADDRESS"`

## Deployed contracts in Mumbai Testnet

NFT_ADDRESS: 0xdab904B02014455c50BE4454E448E7e86dc10B60<br>
TOKEN_ADDRESS: 0xCaD58962487156Ea199F67B1166abb043a244356<br>
RANDOM_NUMBER_ADDRESS: 0x4BeEbdD5Dc280ea9912157cF2C914E3594f32dd6<br>

Test Web: http://
