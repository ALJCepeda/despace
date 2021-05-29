// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

contract Message is Ownable {
    string title;
    string body;

    constructor(string _title, string _body) {
        title = _title;
        body = _body;
    }
}