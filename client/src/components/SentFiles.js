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

  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }

  const download = async(index) => {
    var AESkey = quickEncrypt.decrypt(fileAll[index].senderEncryptedAESKey, privateKey);
    console.log(AESkey)
    console.log(fileAll[index].ipfsHash)
    const chunks = [];
    for await (const chunk of ipfs.cat(fileAll[index].ipfsHash)) {
      chunks.push(...chunk);
    }
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
