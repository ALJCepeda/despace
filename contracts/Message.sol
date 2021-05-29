// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

contract Message is Ownable {
    string public title;
    string public body;

    constructor(string memory _title, string memory _body) {
        title = _title;
        body = _body;
    }
}