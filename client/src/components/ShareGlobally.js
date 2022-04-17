// third party imports
import * as React from "react";

// css imports
import "../css/shareglobally.css";

// mui imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl } from "@mui/material";

// file imports
import getWeb3 from "../utils/getWeb3";
import UserStorage from "../contracts/UserStorage.json";
import UserAccount from "../contracts/UserAccount.json";
import GlobalShare from "../contracts/GlobalShare.json";
import ipfs from "../utils/ipfs";

const ShareGlobally = ({refresh, setRefresh}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [accounts, setAccounts] = React.useState([]);
  const [web3, setWeb3] = React.useState(null);
  const [publickey, setPublickey] = React.useState("");
  const [privatekey, setPrivatekey] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [buffer, setBuffer] = React.useState("");
  const [userContract, setUserContract] = React.useState(null);
  const [globalContract, setGlobalContract] = React.useState(null);

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
      if(globalShareContract) {
        setGlobalContract(globalShareContract);
      }
  }}, [accounts]);

  React.useEffect(async()=>{
    if(userContract) {
      await userContract.methods.getPrivateKey().call({from:accounts[0]})
      .then(res => setPrivatekey(res));
      await userContract.methods.publicKey().call({from:accounts[0]})
      .then(res => setPublickey(res));
    }
  }, [userContract])

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
    const bufferred = await Buffer.from(reader.result);
    setBuffer(bufferred);
  };

  const shareFile = async(e) => {
    e.preventDefault();
    try {
      const ipfsData = await ipfs.add(buffer);
      const ipfsHash = ipfsData.path;
      await globalContract.methods
      .uploadFile(
        fileName,
        ipfsHash
      )
      .send({
        from: accounts[0],
        _fileName: fileName,
        _ipfsHash: ipfsHash
      })
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
        handleClose();
      })
      .catch((e) => {
        console.log(e)
      })
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="share_globally">
        <Button variant="contained" onClick={handleClickOpen}>
          Send Globally
        </Button>
        <Dialog open={open} onClose={handleClose} style= {{backgroundColor: '#181818',color: 'white'}}>
          <DialogTitle>Send Globally</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose file to send to all users:
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <form>
              <div>
                <input type="file" onChange={captureFile} id="ipfs" />
              </div>
              <Button onClick={shareFile}>
                Share File
              </Button>
            </form>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ShareGlobally;
