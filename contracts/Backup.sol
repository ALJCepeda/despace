// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

struct BackupData {
  address app;
  address messages;
}

contract Backup is Ownable {
  BackupData data;

  constructor(address _app, address _messages) {
    data.app = _app;
    data.messages = _messages;
  }

  function get() public view OnlyOwner returns (BackupData memory) {
    return data;
  }
}