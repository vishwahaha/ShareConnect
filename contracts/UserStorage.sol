// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.13.0;

import './UserAccount.sol';

contract UserStorage {

  address[] userAddresses;
  //mapping from user's address to deployed address of a UserAccount contract.
  mapping(address => address) public userData;

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
    userAddresses.push(msg.sender);
    userData[msg.sender] = address(newUser);
  }

}
