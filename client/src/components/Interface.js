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
import '../css/interface.css';

// encryption packages
import { JSEncrypt } from "jsencrypt";
import { padding } from "@mui/system";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography, ListItem, ListItemAvatar, ListItemText, } from "@mui/material";

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
  const [sentFiles1, setSentFiles1] = React.useState({});
  const [sentFiles2, setSentFiles2] = React.useState({});
  const [receivedFiles1, setReceivedFiles1] = React.useState({});
  const [receivedFiles2, setReceivedFiles2] = React.useState({});
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

  React.useEffect(async () => {
    await getWeb3()
      .then(res => setWeb3(res));
    // Use web3 to get the user's accounts.
  }, [])

  React.useEffect(async () => {
    if (web3) {
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
      const users = await shareChannelContract.methods.getChannelUsers().call({ from: accounts[0] })
      if (accounts[0] == users['0']) {
        setSender(users['0']);
        setReceiver(users['1']);
        const sent1 = await shareChannelContract.methods.getSentFiles1(users['0'], users['1']).call({ from: users['0'] });
        const sent2 = await shareChannelContract.methods.getSentFiles2(users['0'], users['1']).call({ from: users['0'] });
        const received1 = await shareChannelContract.methods.getSentFiles1(users['1'], users['0']).call({ from: users['0'] });
        const received2 = await shareChannelContract.methods.getSentFiles2(users['1'], users['0']).call({ from: users['0'] });
        setSentFiles1(sent1);
        setSentFiles2(sent2);
        setReceivedFiles1(received1);
        setReceivedFiles2(received2);
        await userStorageContract.methods
          .getUser()
          .call({ from: users['0'] })
          .then(async (res) => {
            setUserContract1(new web3.eth.Contract(
              UserAccount.abi,
              res
            ));
            const uc1 = new web3.eth.Contract(
              UserAccount.abi,
              res
            )
            await uc1.methods.name().call({ from: users['0'] })
              .then(res => {
                setName1(res)
              });
            await uc1.methods.publicKey().call({ from: users['0'] })
              .then(res => {
                setPublicKey1(res)
              });
            await uc1.methods.getPrivateKey().call({ from: users['0'] })
              .then(res => {
                setPrivateKey1(res)
              });
          })
        await userStorageContract.methods
          .getUser()
          .call({ from: users['1'] })
          .then(async (res) => {
            setUserContract2(new web3.eth.Contract(
              UserAccount.abi,
              res
            ));
            const uc2 = new web3.eth.Contract(
              UserAccount.abi,
              res
            )
            await uc2.methods.name().call({ from: users['1'] })
              .then(res => {
                setName2(res)
              });
            await uc2.methods.publicKey().call({ from: users['1'] })
              .then(res => {
                setPublicKey2(res)
              });
          })
      } else {
        setSender(users['1']);
        setReceiver(users['0']);
        const sent1 = await shareChannelContract.methods.getSentFiles1(users['1'], users['0']).call({ from: users['1'] });
        const sent2 = await shareChannelContract.methods.getSentFiles2(users['1'], users['0']).call({ from: users['1'] });
        const received1 = await shareChannelContract.methods.getSentFiles1(users['0'], users['1']).call({ from: users['1'] });
        const received2 = await shareChannelContract.methods.getSentFiles2(users['0'], users['1']).call({ from: users['1'] });
        setSentFiles1(sent1);
        setSentFiles2(sent2);
        setReceivedFiles1(received1);
        setReceivedFiles2(received2);
        await userStorageContract.methods
          .getUser()
          .call({ from: users['1'] })
          .then(async (res) => {
            setUserContract1(new web3.eth.Contract(
              UserAccount.abi,
              res
            ));
            const uc1 = new web3.eth.Contract(
              UserAccount.abi,
              res
            )
            await uc1.methods.name().call({ from: users['1'] })
              .then(res => {
                setName1(res)
              });
            await uc1.methods.publicKey().call({ from: users['1'] })
              .then(res => {
                setPublicKey1(res)
              });
            await uc1.methods.getPrivateKey().call({ from: users['1'] })
              .then(res => {
                setPrivateKey1(res)
              });
          })
        await userStorageContract.methods
          .getUser()
          .call({ from: users['0'] })
          .then(async (res) => {
            setUserContract2(new web3.eth.Contract(
              UserAccount.abi,
              res
            ));
            const uc2 = new web3.eth.Contract(
              UserAccount.abi,
              res
            )
            await uc2.methods.name().call({ from: users['0'] })
              .then(res => {
                setName2(res)
              });
            await uc2.methods.publicKey().call({ from: users['0'] })
              .then(res => {
                setPublicKey2(res)
              });
          })
      }
    }
  }, [web3]);

  const captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    window.file = event.target.files[0];
    setFileName(window.file.name)
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(window.file);
    reader.onloadend = () => {
      setWordArray(CryptoJS.lib.WordArray.create(reader.result));
    }
  };

  const shareFile = async (e) => {
    e.preventDefault();
    const AESkey = RandomString.generate(8);
    const encrypted = CryptoJS.AES.encrypt(wordArray, AESkey).toString();
    var quickEncryptSender = quickEncrypt.encrypt(AESkey, publicKey1);
    var quickEncryptReceiver = quickEncrypt.encrypt(AESkey, publicKey2);
    const ipfsData = await ipfs.add(encrypted);
    const ipfsHash = ipfsData.path;
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
      }).then(async (res) => {
        const sent1 = await shareChannel.methods.getSentFiles1(sender, receiver).call({ from: sender });
        const sent2 = await shareChannel.methods.getSentFiles2(sender, receiver).call({ from: sender });
        setSentFiles1(sent1);
        setSentFiles2(sent2);
      })
  };


  return (
    <>
      <div className="interface">
        <div style={{ padding: "2rem" }}>
          <SentFiles sentFiles1={sentFiles1} sentFiles2={sentFiles2} privateKey={privateKey1} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "3em",
              marginTop: "3rem"
            }}
          >
            <div style={{ boxShadow: "0 -2px 10px rgba(0, 0, 0, 1)", borderRadius: "10px", background: "#181818" }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar style={{ width: 60, height: 60, }} {...stringAvatar(`${name1}`)}/>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h4"
                      >
                        {name1}
                      </Typography>
                      <Typography style={{ textAlign: "center" }}> {sender} </Typography>
                    </React.Fragment>
                  }
                  sx={{ ml: 1, }}
                />
                </ListItem>
            </div>

            <CompareArrowsIcon sx={{ fontSize: 60 }} />

            <div style={{ boxShadow: "0 -2px 10px rgba(0, 0, 0, 1)",  borderRadius: "10px", background: "#181818" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar style={{ width: 60, height: 60, }} {...stringAvatar(`${name2}`)}/>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h4"
                      >
                        {name2}
                      </Typography>
                      <Typography style={{ textAlign: "center" }}> {receiver} </Typography>
                    </React.Fragment>
                  }
                  sx={{ ml: 1, }}
                />
                </ListItem>
            </div>
          </div>

          <div className="container text-center" style={{ marginBottom: "5em" }}>
            <input type="file" onChange={captureFile} />
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
            <ReceivedFiles receivedFiles1={receivedFiles1} receivedFiles2={receivedFiles2} privateKey={privateKey1} />
        </div>
      </div>
    </>
  );
}

export default Interface;