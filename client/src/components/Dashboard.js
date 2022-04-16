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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

  console.log(name)

  return (
    <>
    <div>
      <div className="flexRow">
      <div className="dashboard" >
        <SharePersonally />
        <div>
          {name ?
            <Avatar {...stringAvatar(name)} className="avatar" />
              : 
            <Avatar {...stringAvatar("User")} className="avatar" />
          }
          <h4 style={{ textAlign: "center", color: "white" }}>
            <strong>{name}</strong>
          </h4>
        </div>
        <ShareGlobally />
        
        </div>
        <div>
          <Button onClick={getFiles}>Show Sent Files</Button>
        </div>
      </div>
        
      <div>
        
        <TableContainer component={Paper} sx={{bgcolor: 'black', borderRadius: 0}}>
          <Table align="center" sx={{ width: '100%', borderRadius: 0, bgcolor: 'black'}} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{color:'white'}}>File</TableCell>
                <TableCell align="center" sx={{color:'white'}}>Sender</TableCell>
                <TableCell align="center" sx={{color:'white'}}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileAll.map((file,index) => (
                <TableRow
                  key={file.fileName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{color:'white'}}>
                    {file.fileName}
                  </TableCell>
                  <TableCell align="center" sx={{color:'white'}}>{file.ipfsHash}</TableCell>
                  <TableCell align="center" sx={{color:'white'}}><Button onClick={() => download(index)}>Download File</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
