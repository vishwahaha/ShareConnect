import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import {
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Interface from "./components/Interface";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: null }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Routes>
        <Route exact path="/" element={<SignUp />}>
          
        </Route>
        <Route exact path="/dashboard" element={<Dashboard />}>
          
        </Route>
        <Route exact path="/channel/:id" element={<Interface />}>
          
        </Route>
      </Routes>
    );
  }
}

export default App;
