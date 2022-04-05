// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

import './UserStorage.sol';

contract GlobalShare is UserStorage {

  struct file {
    string fileName;
    string ipfsHash;
    address sender;
  }
  file[] sharedFiles;

  function uploadFile(
    string memory _fileName,
    string memory _ipfsHash
  ) public isRegistered {
    file memory newFile = file({
      fileName: _fileName,
      ipfsHash: _ipfsHash,
      sender: msg.sender
    });
    sharedFiles.push(newFile);
  }
  
  function getAllFiles() public view isRegistered returns(file[] memory){
    return sharedFiles;
  }
  
}
