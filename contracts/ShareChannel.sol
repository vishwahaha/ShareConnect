// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.13.0;

contract ShareChannel {

  address userA;
  address userB;
  file[] sharedFiles;

  struct file {
    string fileName;
    string ipfsHash;
    string senderEncryptedAESKey;
    string receiverEncryptedAESKey;
    address sender;
    address receiver;
  }

  constructor(address _userA, address _userB) {
    userA = _userA;
    userB = _userB;
  }

  modifier isPartOfChannel() {
    require((msg.sender == userA) || (msg.sender == userB));
    _;
  }

  function sendFile(
    string memory _fileName,
    string memory _ipfsHash,
    string memory _senderEncryptedAESKey,
    string memory _receiverEncryptedAESKey,
    address _receiver
  ) public isPartOfChannel {
    _addFile(_fileName, _ipfsHash, _senderEncryptedAESKey, _receiverEncryptedAESKey, msg.sender, _receiver);
  }
  function receiveFile(
    string memory _fileName,
    string memory _ipfsHash,
    string memory _senderEncryptedAESKey,
    string memory _receiverEncryptedAESKey,
    address _sender
  ) public isPartOfChannel {
    _addFile(_fileName, _ipfsHash, _senderEncryptedAESKey, _receiverEncryptedAESKey, _sender, msg.sender);
  }

  function getSentFiles(address _user) public view isPartOfChannel {
    _findFiles(_user, true);
  }

  function getReceivedFiles(address _user) public view isPartOfChannel {
    _findFiles(_user, false);
  }

  function _addFile(
    string memory _fileName,
    string memory _ipfsHash,
    string memory _senderEncryptedAESKey,
    string memory _receiverEncryptedAESKey,
    address _sender,
    address _receiver
  ) private {
    file memory newFile = file({
      fileName: _fileName,
      ipfsHash: _ipfsHash,
      senderEncryptedAESKey: _senderEncryptedAESKey,
      receiverEncryptedAESKey: _receiverEncryptedAESKey,
      sender: _sender,
      receiver: _receiver
    });
    sharedFiles.push(newFile);
  }

  function _findFiles(address _user, bool _getSent) private view returns (file[] memory) {
    uint arraySize;
    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent){
        if(sharedFiles[i].sender == _user){
          arraySize++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user){
          arraySize++;
        }
      }
    }

    file[] memory files = new file[](arraySize);
    uint j = 0;

    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent){
        if(sharedFiles[i].sender == _user){
          files[j] = sharedFiles[i];
          j++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user){
          files[j] = sharedFiles[i];
          j++;
        }
      }
    }
    return files;
  }

}
