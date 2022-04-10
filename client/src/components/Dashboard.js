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

// mui imports
import { Avatar, Button } from "@mui/material";

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
        console.log(res)
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
    console.log(userContract);
    if(userContract) {
      await userContract.methods.name().call({from:accounts[0]})
      .then(res => setName(res));
    }
  }, [userContract])

  const check = async(e) => {
    e.preventDefault();
    console.log(globalContract)
    const files = await globalContract.methods.getAllFiles().call({from: accounts[0]});
    console.log(files);
  }

  return (
    <div className="dashboard">
      <SharePersonally />
      <div>
        <Avatar {...stringAvatar("Profile User")} className="avatar" />
        <h4 style={{ textAlign: "center" }}>
          <strong>{name}</strong>
        </h4>
        <h5 style={{ textAlign: "center" }}>
          <strong>{accounts[0]}</strong>
        </h5>
      </div>
      <ShareGlobally />
      <Button onClick={check}>Check</Button>
    </div>
  );
};

export default Dashboard;
