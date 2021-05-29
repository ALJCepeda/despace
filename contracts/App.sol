// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Ownable.sol";

struct FeatureInfo {
    string name;
    address location;
    address[] upgrades;
}

contract App is Ownable {
    string public username;
    string public version;
    mapping(string => FeatureInfo) public features;

    constructor(string memory _username, string memory _version) {
        username = _username;
        version = _version;
    }

    function setUsername(string calldata _username) public {
        isOwner();
        username = _username;
    }

    function setVersion(string calldata _version) public {
        isOwner();
        version = _version;
    }

    function addFeature(string calldata _name, address _location) public {
        isOwner();
        FeatureInfo memory info = FeatureInfo(_name, _location, new address[](0));
        features[_name] = info;
    }

    function addUpgrade(string calldata _name, address _location) public {
        isOwner();
        features[_name].upgrades.push(_location);
    }
}