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

function Interface() {

  const [web3, setWeb3] = React.useState(null);
  const [userContract1, setUserContract1] = React.useState(null);
  const [userContract2, setUserContract2] = React.useState(null);
  const [name1, setName1] = React.useState("");
  const [name2, setName2] = React.useState("");
  const [publicKey1, setPublicKey1] = React.useState("");
  const [publicKey2, setPublicKey2] = React.useState("");
  const [privateKey1, setPrivateKey1] = React.useState("");
  const [privateKey2, setPrivateKey2] = React.useState("");
  const [sender, setSender] = React.useState("");
  const [receiver, setReceiver] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [shareChannel, setShareChannel] = React.useState(null);
  const [acc, setAcc] = React.useState([]);
  const [sentFiles, setSentFiles] = React.useState([]);
  const [receivedFiles, setReceivedFiles] = React.useState([]);

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
      if(accounts[0] == users['0']) {
        setSender(users['0']);
        setReceiver(users['1']);
        const sent_files = await shareChannelContract.methods.getSentFiles(users['0']).call({from: users['0']});
        setSentFiles(sent_files);
        const received_files = await shareChannelContract.methods.getReceivedFiles(users['1']).call({from: users['0']});
        setReceivedFiles(received_files);
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
          await uc2.methods.getPrivateKey().call({from:users['1']})
          .then(res => {
            setPrivateKey2(res)
          });
        })
      }else{
        setSender(users['1']);
        setReceiver(users['0']);
        const sent_files = await shareChannelContract.methods.getSentFiles(users['1']).call({from: users['1']});
        setSentFiles(sent_files);
        const received_files = await shareChannelContract.methods.getReceivedFiles(users['0']).call({from: users['1']});
        setReceivedFiles(received_files);
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
          await uc2.methods.getPrivateKey().call({from:users['0']})
          .then(res => {
            setPrivateKey2(res)
          });
        })
      }
      // console.log(userB)
  }}, [web3]);

  // const genPassPhrase = keyLength => {
  //   var randomstring = "";
  //   for (var i = 0; i < keyLength; i++) {
  //     var rnum = Math.floor(Math.random() * chars.length);
  //     randomstring += chars.substring(rnum, rnum + 1);
  //   }
  //   return randomstring;
  // };

  const captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    window.file = event.target.files[0];
    setFileName(window.file.name)
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(window.file);
    reader.onloadend = () => convertToBuffer(reader);
  };

  const convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer: buffer });
  };

  const shareFile = async(e) => {
    e.preventDefault();
    try {
      const ipfsData = await ipfs.add(buffer);
      const ipfsHash = ipfsData.path;
      await shareChannel.methods
      .sendFile(
        fileName,
        ipfsHash
      )
      .send({
        from: acc[0],
        _fileName: fileName,
        _ipfsHash: ipfsHash
      })
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e)
      })
    } catch (e) {
      console.log(e);
    }
  };

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
    </>
  );
}

export default Interface;
