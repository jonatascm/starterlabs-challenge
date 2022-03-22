import { expect } from "chai";
import { ethers } from "hardhat";

describe("SlabsToken", function () {
  it("Should deploy ERC20 Token", async function () {
    const [owner] = await ethers.getSigners();
    const SlabsToken = await ethers.getContractFactory("SlabsToken");
    const slabsToken = await SlabsToken.deploy();
    await slabsToken.deployed();
    const supply = ethers.utils.parseEther(`${10 ** 9}`);
    expect(await slabsToken.totalSupply()).to.equal(supply);
    expect(await slabsToken.balanceOf(owner.address)).to.equal(supply);
  });
});
