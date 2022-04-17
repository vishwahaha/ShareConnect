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
import {convertWordArrayToUint8Array, Utf8ArrayToStr} from '../utils/stringConversion';
var CryptoJS = require("crypto-js");
const quickEncrypt = require("quick-encrypt");
var FileSaver = require('file-saver');

export default function SentFiles({sentFiles1, sentFiles2, privateKey}) {
  const [fileAll, setFileAll] = React.useState([]);
  React.useEffect(() => {
    if(Object.keys(sentFiles1).length > 0 && Object.keys(sentFiles2).length > 0){
      const allfiles = [];
      for(var i = 0; i < sentFiles1[0].length; i++) {
        let file = {
          fileName: sentFiles1[0][i],
          ipfsHash: sentFiles1[1][i],
          senderEncryptedAESKey: sentFiles1[2][i],
          receiverEncryptedAESKey: sentFiles2[0][i],
          sender: sentFiles2[1][i],
          receiver: sentFiles2[2][i],
        }
        allfiles.push(file)
      }
      setFileAll(allfiles);
    }
  }, [sentFiles1, sentFiles2])


  const download = async(index) => {
    var AESkey = quickEncrypt.decrypt(fileAll[index].senderEncryptedAESKey, privateKey);
    const chunks = [];
    // const MAXLEN = 1516288;
    for await (const chunk of ipfs.cat(fileAll[index].ipfsHash)) {
      chunks.push(...chunk);
    }
    var decrypted = CryptoJS.AES.decrypt(Utf8ArrayToStr(chunks), AESkey);
    var uint8array = convertWordArrayToUint8Array(decrypted);
    var blob=new Blob([uint8array],{type:"application/octet-stream;"});
    FileSaver.saveAs(blob, fileAll[index].fileName);
  }


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "40%",
        textAlign:"center"
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 700,
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
                    secondary={
                      <React.Fragment>
                        <Button onClick={() => download(index)}>Download</Button>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            )
          })
        : <div>No files sent</div>}
      </List>
    </div>
  );
}
