// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Ownable {
    address owner;

    constructor () {
        owner = msg.sender;
    }

    function isOwner() public view {
        require(msg.sender == owner, "Must be owner to call");
    }

    function transfer(address newOwner) public {
        isOwner();
        owner = newOwner;
    }
}