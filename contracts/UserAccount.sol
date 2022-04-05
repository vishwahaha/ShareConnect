// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

contract UserAccount {

  address public userAddress;
  string public name;
  string private privateKey;
  string public publicKey;

  modifier isUser() {
    require(userAddress == msg.sender);
    _;
  }

  constructor (
    address _userAddress, 
    string memory _name,
    string memory _publicKey,
    string memory _privateKey
  ) {
    userAddress = _userAddress;
    name = _name;
    publicKey = _publicKey;
    privateKey = _privateKey;
  }

  function getPrivateKey() public view isUser returns(string memory) {
    return privateKey;
  }

}
