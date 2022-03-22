//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./GenerateRandom.sol";

import "hardhat/console.sol";

contract LabMonsterNft is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    IERC20 public slabsToken;
    uint256 constant nftValue = 15 ether;
    GenerateRandom public generateRandom;

    constructor(address _token, address _generateRandom)
        ERC721("LabMonster", "LABMONSTER")
    {
        slabsToken = IERC20(_token);
        generateRandom = GenerateRandom(_generateRandom);
    }

    function requestRandomNumber() external {
        generateRandom.requestRandomNumber(msg.sender);
    }

    function randomMint() external returns (uint256) {
        require(
            slabsToken.balanceOf(msg.sender) > nftValue,
            "Not enough SLABS tokens"
        );
        require(
            slabsToken.allowance(msg.sender, address(this)) >= nftValue,
            "Need token approval first"
        );

        uint256[2] memory randomNumbers = generateRandom.getUserRandomNumber(
            msg.sender
        );
        generateRandom.resetUserRandomNumber(msg.sender);

        uint256 monsterId = (randomNumbers[0] % 5) + 1;
        uint256 strength = (randomNumbers[1] % 100) + 1;

        slabsToken.transferFrom(msg.sender, address(this), nftValue);

        tokenIds.increment();
        uint256 newItemId = tokenIds.current();
        _safeMint(msg.sender, newItemId);

        string memory _tokenURI = string(
            abi.encodePacked(
                '{"name":"Monster ',
                Strings.toString(monsterId),
                "-",
                Strings.toString(strength),
                '","description": "#',
                Strings.toString(newItemId),
                ' Lab Monster NFT","image":"https://ipfs.io/ipfs/QmZWzAUMs8G7Bp9a1w8Kawu8UR71d5mipkyD9f49hsgHm3/monster-',
                Strings.toString(monsterId),
                '.png","attributes":[{"trait_type": "Strength", "value":"',
                Strings.toString(strength),
                '"}]}'
            )
        );

        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function getTokenIds(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory _tokensOfOwner = new uint256[](
            ERC721.balanceOf(_owner)
        );
        uint256 i;

        for (i = 0; i < ERC721.balanceOf(_owner); i++) {
            _tokensOfOwner[i] = ERC721Enumerable.tokenOfOwnerByIndex(_owner, i);
        }
        return (_tokensOfOwner);
    }

    function getTestToken() external {
        require(
            slabsToken.balanceOf(address(this)) >= 15 ether,
            "Without tokens"
        );
        slabsToken.transfer(msg.sender, 15 ether);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
