// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

    struct Message {
        string title;
        string body;
    }

contract Messages is Ownable {
    Message[] public messages;

    function addMessage(string calldata _title, string calldata _body) public OnlyOwner {
        messages.push(Message(_title, _body));
    }

    function all() public view returns (Message[] memory) {
        return messages;
    }

    function length() public view returns (uint) {
        return messages.length;
    }
}