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

export default function SharedFiles() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "40%",
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 700,
          bgcolor: "background.paper",
          overflow: "auto",
          maxHeight: 350,
        }}
      >
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <FileCopyOutlinedIcon />
          </ListItemAvatar>
          <ListItemText
            primary="FILE 1"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  File size
                </Typography>
                {" 35 MB"}
              </React.Fragment>
            }
          />

          <ListItemAvatar>
            <FileCopyOutlinedIcon />
          </ListItemAvatar>
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" /> */}
            <FileCopyOutlinedIcon />
          </ListItemAvatar>
          <ListItemText
            primary="FILE 2"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  File size
                </Typography>
                {" 25 MB"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {/* <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" /> */}
            <FileCopyOutlinedIcon />
          </ListItemAvatar>
          <ListItemText
            primary="FILE 3"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  File size
                </Typography>
                {" 75 MB"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {/* <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" /> */}
            <FileCopyOutlinedIcon />
          </ListItemAvatar>
          <ListItemText
            primary="FILE 4"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  File size
                </Typography>
                {" 100 MB"}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </div>
  );
}
