// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GenerateRandom is VRFConsumerBase, Ownable {
    bytes32 keyHash;
    uint256 internal fee;
    mapping(bytes32 => address) public requestIdToAddress;
    mapping(address => uint256[2]) private userToRandomNumber;

    event CreatedRandomNumber(address indexed _user);

    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.0001 LINK
    }

    function requestRandomNumber(address _user)
        public
        onlyOwner
        returns (bytes32 requestId)
    {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        require(
            userToRandomNumber[_user][0] == 0,
            "User already requested a random number"
        );
        userToRandomNumber[_user][0] = 1;
        requestId = requestRandomness(keyHash, fee);
        requestIdToAddress[requestId] = _user;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        address user = requestIdToAddress[requestId];
        uint256[] memory randomNumbers = expand(randomness, 2);
        userToRandomNumber[user][0] = randomNumbers[0];
        userToRandomNumber[user][1] = randomNumbers[1];

        emit CreatedRandomNumber(user);
    }

    function getUserRandomNumber(address _user)
        external
        view
        onlyOwner
        returns (uint256[2] memory)
    {
        require(
            userToRandomNumber[_user][1] != 0,
            "User not requested a random number"
        );

        return userToRandomNumber[_user];
    }

    function resetUserRandomNumber(address _user) external onlyOwner {
        require(_user != address(0), "Must insert a user to remove");
        delete userToRandomNumber[_user];
    }

    function expand(uint256 randomValue, uint256 n)
        public
        pure
        returns (uint256[] memory expandedValues)
    {
        expandedValues = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
        }
        return expandedValues;
    }
}
