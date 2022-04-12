// file imports
import getWeb3 from "./getWeb3";
import UserStorage from "../contracts/UserStorage.json";

const check_login = async () => {
  const web3 = await getWeb3();
  // Use web3 to get the user's accounts.
  const accounts = await web3.eth.getAccounts();
  // Get the contract instance.
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = UserStorage.networks[networkId];
  const userStorageContract = new web3.eth.Contract(
    UserStorage.abi,
    deployedNetwork && deployedNetwork.address
  );
  const userAddress = await userStorageContract.methods
    .getUser()
    .call({ from: accounts[0] });
  return userAddress;
};

export default check_login;
