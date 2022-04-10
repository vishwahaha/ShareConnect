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
  uint sharedFileSize = 0;

  function uploadFile(
    string memory _fileName,
    string memory _ipfsHash
  ) public isRegistered {
    _addFile(_fileName, _ipfsHash, msg.sender);
  }
  
  function getAllFiles() public view isRegistered returns(file[] memory){
    file[] memory files = new file[](sharedFileSize);
    for (uint i = 0; i< sharedFileSize; i++) {
      files[i] = sharedFiles[i];
    }
    return files;
  }

  function _addFile(string memory _fileName, string memory _ipfsHash, address _sender) private  {
    file memory newFile = file({
      fileName: _fileName,
      ipfsHash: _ipfsHash,
      sender: _sender
    });
    sharedFiles.push(newFile);
    sharedFileSize++;
  }
}
