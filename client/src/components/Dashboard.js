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
import { Avatar, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Scrollbar from './tools/Scrollbar';
import ListHead from "./tools/ListHead";



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
  const [refresh, setRefresh] = React.useState([]);
  const [page, setPage] = useState(0);
  const [emptyRows, setEmptyrows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [filterName, setFilterName] = useState('');

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


  React.useEffect(async() => {
    if(globalContract) {
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
    }
  }, [globalContract, refresh])


  const download = async(index) => {
    const chunks = [];
    for await (const chunk of ipfs.cat(fileAll[index].ipfsHash)) {
      chunks.push(...chunk);
    }
    let buf = new Buffer.from(chunks)
    var blob=new Blob([buf],{type:"application/octet-stream;"});
    FileSaver.saveAs(blob,fileAll[index].fileName);
  }
  const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: '' },
];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <SharePersonally />
        <div>
          {name ?
            <Avatar {...stringAvatar(name)} className="avatar" />
              : 
            <Avatar {...stringAvatar("User")} className="avatar" />
          }
          <h4 style={{ textAlign: "center" }}>
            <strong>{name}</strong>
          </h4>
          <h5 style={{ textAlign: "center" }}>
            <strong>{accounts[0]}</strong>
          </h5>
        </div>
        <ShareGlobally refresh={refresh} setRefresh={setRefresh}/>
      </div>
      <Card className="fileTable">
         <h4 style={{ textAlign: "center" }}>
            <strong>Files shared</strong>
          </h4>
          
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead
                  headLabel={TABLE_HEAD}
                  rowCount={fileAll.length}
                />
                <TableBody>
                  {fileAll.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((file,index) => {

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <FileCopyOutlinedIcon sx={{color:"#fff"}}/>
                            <Typography variant="subtitle2" noWrap color="#fff">
                              {file.fileName}
                            </Typography>
                          </Stack>
                        </TableCell>
        
                        

                        <TableCell align="right">
                          <React.Fragment>
                          <Button onClick={() => download(index)}>Download</Button>
                        </React.Fragment>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[7, 10, 25]}
            component="div"
            count={fileAll.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{color:"white", fill: "white"}}
          />
        </Card>
      
    </div>
  );
};

export default Dashboard;
