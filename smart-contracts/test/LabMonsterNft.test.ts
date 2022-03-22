import { ethers } from "hardhat";
import { expect } from "chai";
import { smock, MockContract } from "@defi-wonderland/smock";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "@ethersproject/bignumber";

import {
  SlabsToken,
  LabMonsterNft,
  GenerateRandom,
  GenerateRandom__factory,
  LabMonsterNft__factory,
} from "../typechain";

describe("LabMonster NFT", () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let token: SlabsToken;
  let generateRandom: MockContract<GenerateRandom>;
  let nft: MockContract<LabMonsterNft>;
  const nftPrice = ethers.utils.parseEther("25.0");

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();
    const SlabsTokenFactory = await ethers.getContractFactory(
      "SlabsToken",
      deployer
    );
    token = await SlabsTokenFactory.deploy();

    const GenerateRandomFactory = await smock.mock<GenerateRandom__factory>(
      "GenerateRandom"
    );

    const LabMonsterNftFactory = await smock.mock<LabMonsterNft__factory>(
      "LabMonsterNft"
    );

    generateRandom = await GenerateRandomFactory.deploy();
    nft = await LabMonsterNftFactory.deploy(
      token.address,
      generateRandom.address
    );

    await generateRandom.transferOwnership(nft.address);
  });
  it("Should deploy with right permissions", async () => {
    expect(await generateRandom.owner()).to.equal(nft.address);
  });

  it("Should generate random number", async () => {
    const randomNumber1 = ethers.BigNumber.from("2");
    const randomNumber2 = ethers.BigNumber.from("50");
    //Mock return of random number generator
    generateRandom.getUserRandomNumber
      .whenCalledWith(deployer.address)
      .returns([randomNumber1, randomNumber2]);

    await token.approve(nft.address, nftPrice);
    await nft.randomMint();

    const nftInfo = await nft.tokenURI(1);

    //Name => Monster Number-Strength
    const monsterName = JSON.parse(nftInfo).name;
    const [monsterN, monsterS] = monsterName.split(" ")[1].split("-");

    expect(await nft.ownerOf(1)).to.equal(deployer.address);
    //Check the expected return of name and strength are rights
    expect(Number(monsterN)).to.equal(3);
    expect(Number(monsterS)).to.equal(51);
  });

  it("Should not generate if the user don't have enought tokens", async () => {
    await expect(nft.connect(user).randomMint()).to.be.revertedWith(
      "Not enough SLABS tokens"
    );
  });

  it("Should not generate if the user don't approve the tokens", async () => {
    await expect(nft.randomMint()).to.be.revertedWith(
      "Need token approval first"
    );
  });

  it("Should not generate if the user don't request a random number first", async () => {
    await token.approve(nft.address, nftPrice);
    await expect(nft.randomMint()).to.be.revertedWith(
      "User not requested a random number"
    );
  });
});
