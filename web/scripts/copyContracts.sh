#!/bin/bash
random_dir="../smart-contracts/artifacts/contracts/GenerateRandom.sol/GenerateRandom.json"
token_dir="../smart-contracts/artifacts/contracts/LabMonsterNft.sol/LabMonsterNft.json"
nft_dir="../smart-contracts/artifacts/contracts/SlabsToken.sol/SlabsToken.json"

dest_dir="./src/contracts"

#Copy files to destination
cp ${random_dir} ${dest_dir}
cp ${token_dir} ${dest_dir}
cp ${nft_dir} ${dest_dir}