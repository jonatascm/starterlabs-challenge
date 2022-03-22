//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SlabsToken is ERC20 {
    constructor() ERC20("Starter Labs Token", "SLABS") {
        _mint(msg.sender, 10**9 * 10**18);
    }
}
