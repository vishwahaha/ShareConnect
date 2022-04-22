// third party imports
import React from "react";

// mui imports
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { Button } from "@mui/material";
import "../css/scrollbar.css"

// file imports
import ipfs from "../utils/ipfs";
import { convertWordArrayToUint8Array, Utf8ArrayToStr } from '../utils/stringConversion';
var CryptoJS = require("crypto-js");
const quickEncrypt = require("quick-encrypt");
var FileSaver = require('file-saver');

export default function ReceivedFiles({ receivedFiles1, receivedFiles2, privateKey }) {
  const [fileAll, setFileAll] = React.useState([]);
  React.useEffect(() => {
    if (Object.keys(receivedFiles1).length > 0 && Object.keys(receivedFiles2).length > 0) {
      const allfiles = [];
      for (var i = 0; i < receivedFiles1[0].length; i++) {
        let file = {
          fileName: receivedFiles1[0][i],
          ipfsHash: receivedFiles1[1][i],
          senderEncryptedAESKey: receivedFiles1[2][i],
          receiverEncryptedAESKey: receivedFiles2[0][i],
          sender: receivedFiles2[1][i],
          receiver: receivedFiles2[2][i],
        }
        allfiles.push(file)
      }
      setFileAll(allfiles);
    }
  }, [receivedFiles1, receivedFiles2])

  const download = async (index) => {
    var AESkey = quickEncrypt.decrypt(fileAll[index].receiverEncryptedAESKey, privateKey);
    let resolvedString = '';
    for await (const chunk of ipfs.cat(fileAll[index].ipfsHash)) {
      resolvedString += Utf8ArrayToStr(chunk);
    }
    var decrypted = CryptoJS.AES.decrypt(resolvedString, AESkey);
    var uint8array = convertWordArrayToUint8Array(decrypted);
    var blob = new Blob([uint8array], { type: "application/octet-stream;" });
    FileSaver.saveAs(blob, fileAll[index].fileName);
  }

  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: '80vw',
        textAlign:"center",
        backgroundColor: "#000",
        borderRadius: 10,
        padding: '10px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Typography
        variant="h4"
      >

        Received files
      </Typography>
      <List
        sx={{
          width: "100%",
          overflow: "auto",
          maxHeight: 200,
        }}
      >
        {fileAll.length > 0 ?
          fileAll.map((file, index) => {
            return (
              <>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <FileCopyOutlinedIcon />
                  </ListItemAvatar>
                  <ListItemText
                    primary={file.fileName}
                  />
                  <Button edge="end" onClick={() => download(index)}>Download</Button>
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            )
          })
        : <div>No files received</div>}
      </List>
    </div>
  );
}
