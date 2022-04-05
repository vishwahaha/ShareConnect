// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;
import './ShareChannel.sol';

contract FileShare {

  address[] shareChannels;
  //mapping from joined address of both users to address of deployed ShareChannel contract
  mapping (bytes => address) userPairToChannel;


  function createChannel(address _userA, address _userB) public {
    require(
      (msg.sender == _userA || msg.sender == _userB) &&
      (userPairToChannel[joinAddresses(_userA, _userB)] == address(0))
    );
    _makeChannel(_userA, _userB);
  }

  function getChannel(address _userA, address _userB) public view returns(address) {
    require(msg.sender == _userA || msg.sender == _userB);
    return userPairToChannel[joinAddresses(_userA, _userB)];
  }

  function _makeChannel(address _userA, address _userB) private {
    ShareChannel newChannel = new ShareChannel(
      _userA,
      _userB
    );
    shareChannels.push(address(newChannel));
    userPairToChannel[joinAddresses(_userA, _userB)] = address(newChannel);
  }

  //returns a combination of two addresses as a string(non-human readable as it is encoded)
  //since this string is unique for every two unique addresses
  //it can be used a key in mapping to find ShareChannel contract's address
  function joinAddresses(address _a1, address _a2) private pure returns(bytes memory) {
    return abi.encodePacked(_a1, '_', _a2);
  }

}
