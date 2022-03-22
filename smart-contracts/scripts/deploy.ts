import { ethers } from "hardhat";

async function main() {
  const SlabsToken = await ethers.getContractFactory("SlabsToken");
  const slabsToken = await SlabsToken.deploy();
  await slabsToken.deployed();
  console.log("Token deployed to:", slabsToken.address);

  const GenerateRandom = await ethers.getContractFactory("GenerateRandom");
  const generateRandom = await GenerateRandom.deploy();
  await generateRandom.deployed();
  console.log("Random deployed to:", generateRandom.address);

  const LabMonsterNft = await ethers.getContractFactory("LabMonsterNft");
  const labMonsterNft = await LabMonsterNft.deploy(
    slabsToken.address,
    generateRandom.address
  );
  await labMonsterNft.deployed();
  console.log("NFT deployed to:", labMonsterNft.address);

  await generateRandom.transferOwnership(labMonsterNft.address);
  console.log("Transfered ownership of Random");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
