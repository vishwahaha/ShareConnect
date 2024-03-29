// third party imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// file imports
import getWeb3 from "../utils/getWeb3";
import UserStorage from "../contracts/UserStorage.json";
import check_login from "../utils/check_login";
import Loader from "../utils/Loader";
import "../css/signup.css";

// mui imports
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const quickEncrypt = require("quick-encrypt");

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/vishwahaha/ShareConnect">
        Share-Connect
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const SignUp = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState("");
  const [accounts, setAccounts] = useState("");
  const [contract, setContract] = useState("");

  let navigate = useNavigate();

  useEffect(async () => {
    try {
      const userAddress = await check_login();
      console.log(userAddress);
      if (userAddress != 0) {
        navigate("/dashboard", { replace: true });
      } else {
        console.log("account doesn't exist");
      }
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(null);
      setAccounts(null);
      setContract(null);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setMessage("Name cannot be empty");
      return;
    }
    setLoading(true);
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    setMessage("waiting on transaction success...");
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = UserStorage.networks[networkId];
    const userStorageContract = new web3.eth.Contract(
      UserStorage.abi,
      deployedNetwork && deployedNetwork.address
    );
    const userAddress = await userStorageContract.methods
      .getUser()
      .call({ from: accounts[0] });
    if (userAddress == 0) {
      // account doesn't exist on blockchain
      let keys = quickEncrypt.generate(2048);
      console.log(keys);
      console.log(keys.public);
      console.log(keys.private);
      await userStorageContract.methods
        .createUser(name, keys.public, keys.private)
        .send({
          from: accounts[0],
          _name: name,
          _publickey: keys.public,
          _privatekey: keys.private,
        })
        .then((res) => {
          setLoading(false);
          navigate("/dashboard", { replace: true });
          setMessage(
            "You have registered successfully, redirecting to dashboard ..."
          );
          console.log(message);
        })
        .catch((err) => {
          console.log(err);
          setMessage("Error occured. Please try again");
          setLoading(false);
        });
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="sign-up">
        <Container component="main" maxWidth="xs" className="container-div">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register to BlockChain
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <h3 style={{ color: "red", textAlign: "center" }}>{message}</h3>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default SignUp;
