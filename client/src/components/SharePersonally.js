// third party imports
import * as React from "react";

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

const SharePersonally = () => {
  const [open, setOpen] = React.useState(false);
  const [metaaddress, setMetaaddress] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
      <div className="send_personally">
        <Button variant="contained" onClick={handleClickOpen}>
          Send Personally
        </Button>
        <Dialog open={open} onClose={handleClose}>
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
              console.log(metaaddress)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Add</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SharePersonally;
