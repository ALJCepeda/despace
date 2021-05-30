// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Ownable {
    address owner;

    constructor () {
        owner = msg.sender;
    }

    modifier OnlyOwner {
        require(msg.sender == owner, 'Must be owner to call');
        _;
    }

    function transfer(address newOwner) public OnlyOwner {
        owner = newOwner;
    }
}