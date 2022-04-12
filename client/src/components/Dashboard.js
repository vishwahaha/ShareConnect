// third party imports
import * as React from "react";
import { useNavigate } from "react-router";

// css imports
import "../css/dashboard.css";

// file imports
import SharePersonally from "./SharePersonally";
import ShareGlobally from "./ShareGlobally";
import stringAvatar from "../utils/Avatar";
import check_login from "../utils/check_login";
import UserAccount from "../contracts/UserAccount.json";
import UserStorage from "../contracts/UserStorage.json";
import GlobalShare from "../contracts/GlobalShare.json";
import getWeb3 from "../utils/getWeb3";
import ipfs from "../utils/ipfs";

// mui imports
import { Avatar, Button, CardContent } from "@mui/material";

var FileSaver = require('file-saver');

const Dashboard = () => {
  
  let navigate = useNavigate();

  React.useEffect(async () => {
    const userAddress = await check_login();
    if (userAddress == 0) {
      navigate("/", { replace: true });
    }
  }, []);

  const [accounts, setAccounts] = React.useState([]);
  const [web3, setWeb3] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [userContract, setUserContract] = React.useState(null);
  const [globalContract, setGlobalContract] = React.useState(null);
  const [globalFiles, setGlobalFiles] = React.useState(null);
  const [fileAll, setFileAll] = React.useState([]);
  const [show, setShow] = React.useState(false);

  React.useEffect(async() => {
    await getWeb3()
    .then(res => setWeb3(res));
    // Use web3 to get the user's accounts.
  }, [])
  React.useEffect(async()=>{
    if(web3){
      await web3.eth.getAccounts()
      .then(res => setAccounts(res));
  }}, [web3])
  
  React.useEffect(async() => {
    if(web3){
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = UserStorage.networks[networkId];
      const userStorageContract = new web3.eth.Contract(
        UserStorage.abi,
        deployedNetwork && deployedNetwork.address
      );
      await userStorageContract.methods
      .getUser()
      .call({ from: accounts[0] })
      .then(async (res)=> {
        setUserContract(new web3.eth.Contract(
          UserAccount.abi,
          res
        ));
      })
  }}, [accounts]);

  React.useEffect(async() => {
    if(web3){
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GlobalShare.networks[networkId];
      const globalShareContract = new web3.eth.Contract(
        GlobalShare.abi,
        deployedNetwork && deployedNetwork.address
      );
      setGlobalContract(globalShareContract);
  }}, [accounts]);

  React.useEffect(async()=>{
    if(userContract) {
      await userContract.methods.name().call({from:accounts[0]})
      .then(res => setName(res));
    }
  }, [userContract])

  const getFiles = async(e) => {
    e.preventDefault();
    const files = await globalContract.methods.getAllFiles().call({from: accounts[0]});
    setGlobalFiles(files);
    const allfiles = [];
    for(var i = 0; i < files[0].length; i++) {
      let file = {
        fileName: files[0][i],
        ipfsHash: files[1][i],
        sender: files[2][i]
      }
      allfiles.push(file)
    }
    setFileAll(allfiles);
    console.log(fileAll);
    setShow(true);
  }

  const download = async(index) => {
    const chunks = [];
    for await (const chunk of ipfs.cat(fileAll[index].ipfsHash)) {
      chunks.push(...chunk);
    }
    let buf = new Buffer.from(chunks)
    var blob=new Blob([buf],{type:"application/octet-stream;"});
    FileSaver.saveAs(blob,fileAll[index].fileName);
  }

  return (
    <>
      <div className="dashboard">
        <SharePersonally />
        <div>
          <Avatar {...stringAvatar("Profile User")} className="avatar" />
          <h4 style={{ textAlign: "center" }}>
            <strong>{name}</strong>
          </h4>
          <h5 style={{ textAlign: "center" }}>
            <strong>{accounts[0]}</strong>
          </h5>
        </div>
        <ShareGlobally />
      </div>
      <div>
        <Button onClick={getFiles}>Check</Button>
        {show && fileAll.length > 0 ?
          fileAll.map((file, index) => {
            return (
              <>
                <li key={index}>
                  <div>
                    {file.fileName}
                  </div>
                  <div>
                    {file.ipfsHash}
                  </div>
                  <div>
                    {file.sender}
                  </div>
                  <Button onClick={() => download(index)}>Download File</Button>
                </li>
              </>
            )
          })
        : null}
      </div>
    </>
  );
};

export default Dashboard;
