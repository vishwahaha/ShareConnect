// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

contract ShareChannel {

  address public userA;
  address public userB;

  struct file {
    string fileName;
    string ipfsHash;
    string senderEncryptedAESKey;
    string receiverEncryptedAESKey;
    address sender;
    address receiver;
  }

  file[] sharedFiles;

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

  //COMMENTED FOR NOW AS I THINK THIS IS REDUNDANT: VISHWA

  // function receiveFile(
  //   string memory _fileName,
  //   string memory _ipfsHash,
  //   string memory _senderEncryptedAESKey,
  //   string memory _receiverEncryptedAESKey,
  //   address _sender
  // ) public isPartOfChannel {
  //   _addFile(_fileName, _ipfsHash, _senderEncryptedAESKey, _receiverEncryptedAESKey, _sender, msg.sender);
  // }

  function getSentFiles1(address _user1, address _user2) public view returns (
    string[] memory,
    string[] memory,
    string[] memory
   ) {
    uint arraySize = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          arraySize++;
        }
    }

    string[] memory fileName = new string[](arraySize);
    string[] memory ipfsHash = new string[](arraySize);
    string[] memory senderEncryptedAESKey = new string[](arraySize);

    uint j = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          fileName[j] = sharedFiles[i].fileName;
          ipfsHash[j] = sharedFiles[i].ipfsHash;
          senderEncryptedAESKey[j] = sharedFiles[i].senderEncryptedAESKey;
          j += 1;
        }
    }

    return (
      fileName,
      ipfsHash,
      senderEncryptedAESKey
    );
  }

function getSentFiles2(address _user1, address _user2) public view returns (
    string[] memory,
    address[] memory,
    address[] memory
   ) {
    uint arraySize = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          arraySize++;
        }
    }

    string[] memory receiverEncryptedAESKey = new string[](arraySize);
    address[] memory sender = new address[](arraySize);
    address[] memory receiver = new address[](arraySize);

    uint j = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          receiverEncryptedAESKey[j] = sharedFiles[i].receiverEncryptedAESKey;
          sender[j] = sharedFiles[i].sender;
          receiver[j] = sharedFiles[i].receiver;
          j += 1;
        }
    }

    return (
      receiverEncryptedAESKey,
      sender,
      receiver
    );
  }

  function getChannelUsers() public view returns(address, address){
    return (userA, userB);
  }

  function getSharedFiles() public view returns (string[] memory,
    string[] memory,
    string[] memory,
    string[] memory,
    address[] memory,
    address[] memory
  ){
    string[] memory fileName = new string[](sharedFiles.length);
    string[] memory ipfsHash = new string[](sharedFiles.length);
    string[] memory senderEncryptedAESKey = new string[](sharedFiles.length);
    string[] memory receiverEncryptedAESKey = new string[](sharedFiles.length);
    address[] memory sender = new address[](sharedFiles.length);
    address[] memory receiver = new address[](sharedFiles.length);
    for (uint i = 0; i < sharedFiles.length; i++) {
        fileName[i] = sharedFiles[i].fileName;
        ipfsHash[i] = sharedFiles[i].ipfsHash;
        senderEncryptedAESKey[i] = sharedFiles[i].senderEncryptedAESKey;
        receiverEncryptedAESKey[i] = sharedFiles[i].receiverEncryptedAESKey;
        sender[i] = sharedFiles[i].sender;
        receiver[i] = sharedFiles[i].receiver;
    }
    return (fileName, ipfsHash,senderEncryptedAESKey, receiverEncryptedAESKey,sender, receiver);
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

}
