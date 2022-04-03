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

const ShareGlobally = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Send Globally</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose file to send to all users:
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" component="label">
              Upload File
              <input type="file" hidden />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ShareGlobally;
