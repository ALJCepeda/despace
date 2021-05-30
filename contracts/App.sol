// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

  struct AppInfo {
    string name;
    string version;
  }

contract App is Ownable {
  AppInfo private info;

  constructor(string memory _name, string memory _version) {
    info.name = _name;
    info.version = _version;
  }

  function get() public view returns (AppInfo memory) {
    return info;
  }

  function name(string calldata _name) public OnlyOwner {
    info.name = _name;
  }

  function version(string calldata _version) public OnlyOwner {
    info.version = _version;
  }
}