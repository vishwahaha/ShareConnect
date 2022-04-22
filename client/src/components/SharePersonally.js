// third party imports
import * as React from "react";
import { useNavigate } from "react-router-dom";

// css imports
import "../css/sharepersonally.css";

// mui imports
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import getWeb3 from "../utils/getWeb3";
import UserStorage from "../contracts/UserStorage.json";
import FileShare from "../contracts/FileShare.json";
import ShareChannel from "../contracts/ShareChannel.json"
import { Alert } from '@mui/material';

const SharePersonally = () => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [metaaddress, setMetaaddress] = React.useState("");
  const [web3, setWeb3] = React.useState(null);

  let navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  React.useEffect(async () => {
    await getWeb3()
      .then(res => setWeb3(res));
    // Use web3 to get the user's accounts.
  }, [])

  const submitAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserStorage.networks[networkId];
    const userStorageContract = new web3.eth.Contract(
      UserStorage.abi,
      deployedNetwork && deployedNetwork.address
    );
    const dn2 = FileShare.networks[networkId];

    const fileShareContract = new web3.eth.Contract(
      FileShare.abi,
      dn2 && dn2.address
    )
    const userAddress = await userStorageContract.methods
      .getUserFromAddress(metaaddress)
      .call({ from: accounts[0] });
    if (userAddress == 0) {
      setError(true)
      setErrorText("The user doesn't exist on our website")
    }
    else {
      setError(false)
      setErrorText("")

      const channel1 = await fileShareContract.methods
        .getChannel(accounts[0], metaaddress)
        .call({ from: accounts[0] });

      const channel2 = await fileShareContract.methods
        .getChannel(metaaddress, accounts[0])
        .call({ from: accounts[0] });

      if (channel1 == 0 && channel2 == 0) {
        await fileShareContract.methods
          .createChannel(accounts[0], metaaddress)
          .send({ from: accounts[0] });
        //Get the new channel now.
        const channel1 = await fileShareContract.methods
        .getChannel(accounts[0], metaaddress)
        .call({ from: accounts[0] });

        const channel2 = await fileShareContract.methods
          .getChannel(metaaddress, accounts[0])
          .call({ from: accounts[0] });

        let channelAddress = channel1 == 0 ? channel2 : channel1;
        const shareChannelContract = new web3.eth.Contract(
          ShareChannel.abi,
          channelAddress
        );
        navigate(`/channel/${channelAddress}`, { replace: true });
      }
      else {
        let channelAddress = channel1 == 0 ? channel2 : channel1;
        const shareChannelContract = new web3.eth.Contract(
          ShareChannel.abi,
          channelAddress
        );
        navigate(`/channel/${channelAddress}`, { replace: true });
      }
    }
  }

  const checkValidity = () => {
    try {
      const address = web3.utils.toChecksumAddress(metaaddress)
      setError(false)
      setErrorText("")
      submitAddress()
      return address
    } catch (e) {
      setError(true)
      setErrorText("Please enter a valid metaaddress!")
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="send_personally">
        <Button variant="contained" onClick={handleClickOpen}>
          Send Personally
        </Button>
        <Dialog open={open} onClose={handleClose} style= {{backgroundColor: '#181818',color: 'white'}}>
          <DialogTitle>Send File Personally</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter MetaMask address of reciever:
            </DialogContentText>
            <TextField
              autoFocus
              margin="none"
              id="name"
              label="MetaMask Address"
              type="string"
              fullWidth
              variant="standard"
              onChange={e => {
                setMetaaddress(e.target.value)
              }}
            />
            {error &&
              <Alert severity="error" open={false}>{errorText}</Alert>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={checkValidity}>Send</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SharePersonally;
