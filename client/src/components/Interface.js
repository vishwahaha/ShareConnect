// third party imports
import ReactDOM from "react-dom";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

// file imports
import stringAvatar from "../utils/Avatar";
import check_login from "../utils/check_login";
import getWeb3 from "../utils/getWeb3";
import UserStorage from "../contracts/UserStorage.json";
import UserAccount from "../contracts/UserAccount.json";
import ShareChannel from "../contracts/ShareChannel.json";
import ipfs from "../utils/ipfs";
import SentFiles from "./SentFiles";
import ReceivedFiles from "./ReceivedFiles";

// mui imports
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

// encryption packages
import { JSEncrypt } from "jsencrypt";
var CryptoJS = require("crypto-js");
var RandomString = require("randomstring");
var FileSaver = require('file-saver');
const quickEncrypt = require("quick-encrypt");

function Interface() {

  const [web3, setWeb3] = React.useState(null);
  const [userContract1, setUserContract1] = React.useState(null);
  const [userContract2, setUserContract2] = React.useState(null);
  const [name1, setName1] = React.useState("");
  const [name2, setName2] = React.useState("");
  const [publicKey1, setPublicKey1] = React.useState("");
  const [publicKey2, setPublicKey2] = React.useState("");
  const [privateKey1, setPrivateKey1] = React.useState("");
  const [sender, setSender] = React.useState(null);
  const [receiver, setReceiver] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [shareChannel, setShareChannel] = React.useState(null);
  const [acc, setAcc] = React.useState([]);
  const [sentFiles, setSentFiles] = React.useState([]);
  const [receivedFiles, setReceivedFiles] = React.useState([]);
  const [wordArray, setWordArray] = React.useState([]);
  // const [encrypted, setEncrypted] = React.useState("");

  let navigate = useNavigate();
  let { id } = useParams();

  React.useEffect(async () => {
    const userAddress = await check_login();
    if (userAddress == 0) {
      navigate("/", { replace: true });
    }
  }, []);

  React.useEffect(async() => {
    await getWeb3()
    .then(res => setWeb3(res));
    // Use web3 to get the user's accounts.
  }, [])
  
  React.useEffect(async() => {
    if(web3){
      const accounts = await web3.eth.getAccounts();
      setAcc(accounts);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UserStorage.networks[networkId];
      const userStorageContract = new web3.eth.Contract(
        UserStorage.abi,
        deployedNetwork && deployedNetwork.address
      );
      const shareChannelContract = new web3.eth.Contract(
        ShareChannel.abi,
        id
      );
      setShareChannel(shareChannelContract);
      const users = await shareChannelContract.methods.getChannelUsers().call({from: accounts[0]})
      console.log(users['0']);
      console.log(users['1']);
      if(accounts[0] == users['0']) {
        setSender(users['0']);
        setReceiver(users['1']);
        await userStorageContract.methods
        .getUser()
        .call({ from: users['0'] })
        .then(async (res)=> {
          setUserContract1(new web3.eth.Contract(
            UserAccount.abi,
            res
          ));
          const uc1 = new web3.eth.Contract(
            UserAccount.abi,
            res
          )
          await uc1.methods.name().call({from:users['0']})
          .then(res => {
            setName1(res)
          });
          await uc1.methods.publicKey().call({from:users['0']})
          .then(res => {
            setPublicKey1(res)
          });
          await uc1.methods.getPrivateKey().call({from:users['0']})
          .then(res => {
            setPrivateKey1(res)
          });
        })
        await userStorageContract.methods
        .getUser()
        .call({ from: users['1'] })
        .then(async (res)=> {
          setUserContract2(new web3.eth.Contract(
            UserAccount.abi,
            res
          ));
          const uc2 = new web3.eth.Contract(
            UserAccount.abi,
            res
          )
          await uc2.methods.name().call({from:users['1']})
          .then(res => {
            setName2(res)
          });
          await uc2.methods.publicKey().call({from:users['1']})
          .then(res => {
            setPublicKey2(res)
          });
        })
      }else{
        setSender(users['1']);
        setReceiver(users['0']);
        await userStorageContract.methods
        .getUser()
        .call({ from: users['1'] })
        .then(async (res)=> {
          setUserContract1(new web3.eth.Contract(
            UserAccount.abi,
            res
          ));
          const uc1 = new web3.eth.Contract(
            UserAccount.abi,
            res
          )
          await uc1.methods.name().call({from:users['1']})
          .then(res => {
            setName1(res)
          });
          await uc1.methods.publicKey().call({from:users['1']})
          .then(res => {
            setPublicKey1(res)
          });
          await uc1.methods.getPrivateKey().call({from:users['1']})
          .then(res => {
            setPrivateKey1(res)
          });
        })
        await userStorageContract.methods
        .getUser()
        .call({ from: users['0'] })
        .then(async (res)=> {
          setUserContract2(new web3.eth.Contract(
            UserAccount.abi,
            res
          ));
          const uc2 = new web3.eth.Contract(
            UserAccount.abi,
            res
          )
          await uc2.methods.name().call({from:users['0']})
          .then(res => {
            setName2(res)
          });
          await uc2.methods.publicKey().call({from:users['0']})
          .then(res => {
            setPublicKey2(res)
          });
        })
      }
  }}, [web3]);

  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

  const captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    window.file = event.target.files[0];
    setFileName(window.file.name)
    console.log(window.file)
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(window.file);
    reader.onloadend = () => {
      // const AESkey = RandomString.generate(8);
      setWordArray(CryptoJS.lib.WordArray.create(reader.result));           // Convert: ArrayBuffer -> WordArray
      console.log(wordArray)
      // const encrypted = CryptoJS.AES.encrypt(wordArray, AESkey).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
      // console.log(encrypted)
      // var decrypted = CryptoJS.AES.decrypt(encrypted, AESkey);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
      // console.log("decrypted wordArray-------------", decrypted)
      // var uint8array = convertWordArrayToUint8Array(decrypted);
      // console.log("decrypted uint8array-------------", uint8array)
      // var blob=new Blob([uint8array],{type:"application/octet-stream;"});
      // FileSaver.saveAs(blob, window.file.name);
    }
  };

  // const convertToBuffer = async reader => {
  //   const buffer = await Buffer.from(reader.result);
  //   setBuffer(buffer)
  // };

  const shareFile = async(e) => {
    e.preventDefault();
    // try { 
      const AESkey = RandomString.generate(8);
      console.log(AESkey);
      const encrypted = CryptoJS.AES.encrypt(wordArray, AESkey).toString();
      console.log(encrypted)
      var quickEncryptSender = quickEncrypt.encrypt(AESkey, publicKey1);
      var quickEncryptReceiver =  quickEncrypt.encrypt(AESkey, publicKey2);
      console.log(quickEncryptSender);
      console.log(quickEncryptReceiver);
      const ipfsData = await ipfs.add(encrypted);
      const ipfsHash = ipfsData.path;
      console.log(ipfsHash)
      await shareChannel.methods
      .sendFile(
        fileName,
        ipfsHash,
        quickEncryptSender,
        quickEncryptReceiver,
        receiver
      ).send({
        from: sender,
        _fileName: fileName,
        _ipfsHash: ipfsHash,
        _quickEncryptSender: quickEncryptSender,
        _quickEncryptReceiver: quickEncryptReceiver,
        _receiver: receiver
      }).then(res => {
        console.log("hello1----------->")
        console.log(res)
      })
      // JSEncryptSender.setPublicKey(publicKey1);
      // JSEncryptReceiver.setPublicKey(publicKey2);
      // const encryptedBuffer = CryptoJS.AES.encrypt(encrypted,AESkey);
      // console.log(buffer)
      // console.log(encrypted)
      // const ipfsData = await ipfs.add(encryptedBuffer);
      // const ipfsHash = ipfsData.path;
      // const senderEncryptedAESkey = JSEncryptSender.encrypt(AESkey);
      // const receiverEncryptedAESkey = JSEncryptReceiver.encrypt(AESkey);
      // await shareChannel.methods
      // .sendFile(
      //   fileName,
      //   ipfsHash,
      //   senderEncryptedAESkey,
      //   receiverEncryptedAESkey,
      //   receiver
      // )
      // .send({
      //   from: acc[0],
      //   _fileName: fileName,
      //   _ipfsHash: ipfsHash,
      //   _senderEncryptedAESKey: senderEncryptedAESkey,
      //   _receiverEncryptedAESKey: receiverEncryptedAESkey,
      //   _receiver: receiver
      // })
      // .then((res) => {
      //   console.log(res)
      // })
      // .catch((e) => {
      //   console.log(e)
      // })
    // } catch (e) {
    //   console.log(e);
    // }
  };

  // console.log(sentFiles);
  // console.log(receivedFiles);
  const getFiles = async(e) => {
    e.preventDefault();
    console.log("hello");
    const res1 = await shareChannel.methods.getSentFiles1(sender, receiver).call({from: sender});
    const res2 = await shareChannel.methods.getSentFiles2(sender, receiver).call({from: sender});
    console.log(res1, res2);
    
    // console.log(Object.keys(files1).length);
    // const files2 = await shareChannel.methods.getSentFiles(receiver).call({from: sender});
    // const files1 = await shareChannel.methods._calcArraySize(sender, receiver, false).call({from: sender});
    // const files2 = await shareChannel.methods._calcArraySize(sender, receiver, true).call({from: sender});
    // console.log(files1);
    // console.log(files2);
  }



  return (
    <>
    <div>
      <div>
        <div text="container" className="text-center my-3">
          <h3>Sent files</h3>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: "2em",
          }}
        >
          <div>
            <Avatar {...stringAvatar(`${name1}`)} />
            <h4 style={{ textAlign: "center" }}> {name1} </h4>
            <h5 style={{ textAlign: "center" }}> {sender} </h5>
          </div>
          <SentFiles />
          <div>
            <Avatar {...stringAvatar(`${name2}`)} />
            <h4 style={{ textAlign: "center" }}> {name2} </h4>
            <h5 style={{ textAlign: "center" }}> {receiver} </h5>
          </div>
        </div>
        <div className="container text-center">
          <input type="file" onChange={captureFile}/>
          <Button
            size="large"
            variant="contained"
            color="success"
            component="label"
            onClick={shareFile}
          >
            Send file
          </Button>
        </div>
        <div
          text="container"
          className="text-center"
          style={{ marginTop: "2em" }}
        >
          <h3>Received files</h3>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "auto", width: "40%" }}>
          {" "}
          <ReceivedFiles />
        </div>
      </div>
    </div>
    <Button onClick={getFiles}>Check</Button>
    </>
  );
}

export default Interface;