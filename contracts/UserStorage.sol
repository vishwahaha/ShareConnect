// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

import './UserAccount.sol';

contract UserStorage {

  address[] userAddresses;
  //mapping from user's address to deployed address of a UserAccount contract.
  mapping(address => address) public userData;

  modifier isRegistered() {
    require(userData[msg.sender] != address(0));
    _;
  }

  function createUser( 
    string memory _name,
    string memory _publicKey,
    string memory _privateKey
  ) public {
    require(userData[msg.sender] == address(0));
    _makeUser(msg.sender, _name, _publicKey, _privateKey);
  }

  function getUser() public view returns(address) {
    return userData[msg.sender];
  }

  function getUserFromAddress(address _address) public view isRegistered returns(address) {
    if(userData[_address] != address(0)){
      return userData[_address];
    }
    else {
      return address(0);
    }
  }

  function _makeUser(
    address _userAddress,
    string memory _name,
    string memory _publicKey,
    string memory _privateKey
  ) private {
    UserAccount newUser = new UserAccount(
      _userAddress, 
      _name,
      _publicKey, 
      _privateKey
    );
    userAddresses.push(_userAddress);
    userData[_userAddress] = address(newUser);
  }

}
