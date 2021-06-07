// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

  struct AppInfo {
    string name;
    string version;
  }

contract App is Ownable {
  AppInfo public info;
  address[] public features;

  constructor(AppInfo memory _info, address[] memory _features) {
    info = _info;
    features = _features;
  }

  function updateInfo(AppInfo memory _info) OnlyOwner external {
    info = _info;
  }

  function setFeatures(address[] memory _features) OnlyOwner external {
    features = _features;
  }

  function addFeature(address _feature) OnlyOwner external {
    features.push(_feature);
  }
}