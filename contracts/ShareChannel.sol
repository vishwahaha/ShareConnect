// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.13;

contract ShareChannel {

  address public userA;
  address public userB;
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

  function getSentFiles(address _user1, address _user2) public view {
    _findFiles(_user1, _user2, true);
  }

  function getReceivedFiles(address _user1, address _user2) public view isPartOfChannel {
    _findFiles(_user1, _user2, false);
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

  function _findFiles(
    address _user1, 
    address _user2,
    bool _getSent
  ) private view returns (
    string[] memory,
    string[] memory,
    string[] memory
    // string[] memory,
    // address[] memory,
    // address[] memory
  ){
    //Destructure the return values.
    // (
    //   string[] memory fileName,
    //   string[] memory ipfsHash,
    //   string[] memory senderEncryptedAESKey
    // ) = _findFiles1(_user1, _user2, _getSent);

    // (
    //   string[] memory receiverEncryptedAESKey,
    //   address[] memory sender,
    //   address[] memory receiver
    // ) = _findFiles2(_user1, _user2, _getSent);

    uint arraySize = _calcArraySize(_user1, _user2, _getSent);

    string[] memory fileName = new string[](arraySize);
    string[] memory ipfsHash = new string[](arraySize);
    string[] memory senderEncryptedAESKey = new string[](arraySize);

    uint j = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent == true){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          fileName[j] = sharedFiles[i].fileName;
          ipfsHash[j] = sharedFiles[i].ipfsHash;
          senderEncryptedAESKey[j] = sharedFiles[i].senderEncryptedAESKey;
          j++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user1 && sharedFiles[i].sender == _user2){
          fileName[j] = sharedFiles[i].fileName;
          ipfsHash[j] = sharedFiles[i].ipfsHash;
          senderEncryptedAESKey[j] = sharedFiles[i].senderEncryptedAESKey;
          j++;
        }
      }
    }

    return (
      fileName,
      ipfsHash,
      senderEncryptedAESKey
      // receiverEncryptedAESKey,
      // sender,
      // receiver
    );
  }

  //Divide the function into two to avoid 'stack too deep' errors.

  function _findFiles1(
    address _user1,
    address _user2, 
    bool _getSent
  ) private view returns (
    string[] memory,
    string[] memory,
    string[] memory
  ) {

    uint arraySize = _calcArraySize(_user1, _user2, _getSent);

    string[] memory fileName = new string[](arraySize);
    string[] memory ipfsHash = new string[](arraySize);
    string[] memory senderEncryptedAESKey = new string[](arraySize);

    uint j = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          fileName[j] = sharedFiles[i].fileName;
          ipfsHash[j] = sharedFiles[i].ipfsHash;
          senderEncryptedAESKey[j] = sharedFiles[i].senderEncryptedAESKey;
          j++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user1 && sharedFiles[i].sender == _user2){
          fileName[j] = sharedFiles[i].fileName;
          ipfsHash[j] = sharedFiles[i].ipfsHash;
          senderEncryptedAESKey[j] = sharedFiles[i].senderEncryptedAESKey;
          j++;
        }
      }
    }
  
    return (
      fileName, 
      ipfsHash, 
      senderEncryptedAESKey
    );
  }

  function _findFiles2(
    address _user1, 
    address _user2,
    bool _getSent
  ) private view returns (
    string[] memory,
    address[] memory,
    address[] memory
  ) {
    uint arraySize = _calcArraySize(_user1, _user2, _getSent);

    string[] memory receiverEncryptedAESKey = new string[](arraySize);
    address[] memory sender = new address[](arraySize);
    address[] memory receiver = new address[](arraySize);

    uint j = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          receiverEncryptedAESKey[j] = sharedFiles[i].receiverEncryptedAESKey;
          sender[j] = sharedFiles[i].sender;
          receiver[j] = sharedFiles[i].receiver;
          j++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user1 && sharedFiles[i].sender == _user2){
          receiverEncryptedAESKey[j] = sharedFiles[i].receiverEncryptedAESKey;
          sender[j] = sharedFiles[i].sender;
          receiver[j] = sharedFiles[i].receiver;
          j++;
        }
      }
    }

    return (
      receiverEncryptedAESKey,
      sender,
      receiver
    );
  }

  function _calcArraySize(address _user1, address _user2, bool _getSent) public view returns(uint){
    uint size = 0;
    for(uint i = 0; i < sharedFiles.length; i++){
      if(_getSent){
        if(sharedFiles[i].sender == _user1 && sharedFiles[i].receiver == _user2){
          size++;
        }
      }
      else {
        if(sharedFiles[i].receiver == _user1 && sharedFiles[i].sender == _user2){
          size++;
        }
      }
    }
    return size;
  }

}