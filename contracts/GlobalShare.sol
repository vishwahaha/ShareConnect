// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

import './UserStorage.sol';

contract GlobalShare {

  struct file {
    string fileName;
    string ipfsHash;
    address sender;
  }
  file[] sharedFiles;

  function uploadFile(
    string memory _fileName,
    string memory _ipfsHash
  ) public {
    _addFile(_fileName, _ipfsHash, msg.sender);
  }
  
  function getAllFiles() public view returns(string[] memory, string[] memory, address[] memory){
    string[] memory fileName = new string[](sharedFiles.length);
    string[] memory ipfsHash = new string[](sharedFiles.length);
    address[] memory sender = new address[](sharedFiles.length);
    for (uint i = 0; i < sharedFiles.length; i++) {
        fileName[i] = sharedFiles[i].fileName;
        ipfsHash[i] = sharedFiles[i].ipfsHash;
        sender[i] = sharedFiles[i].sender;
    }
    return (fileName, ipfsHash, sender);
  }

  function _addFile(string memory _fileName, string memory _ipfsHash, address _sender) private  {
    file memory newFile = file({
      fileName: _fileName,
      ipfsHash: _ipfsHash,
      sender: _sender
    });
    sharedFiles.push(newFile);
  }
}
