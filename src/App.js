import React, { useState } from 'react';
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';

import Elonium from './contracts/Elonium.json';
import OwnerCard from './components/OwnerCard';

import '@celo-tools/use-contractkit/lib/styles.css';
import './App.css';
import { Divider } from '@mui/material';

function AppInside () {
  const [supply, setSupply] = useState(0);
  const [balance, setBalance] = useState(0);
  const [owner, setOwner] = useState(null);
  const [loader, setLoader] = useState(false);
  
  // const { address, connect } = useContractKit()
  const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
  const kit = newKitFromWeb3(web3); 
  const PRIVATE_KEY = '209e653bd3a9b0ddcb075164586b3a6dae7494a378a89895550849a2bbe52fed';
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  kit.connection.addAccount(account.privateKey);
  kit.defaultAccount = account.address;
  let elonium = new kit.connection.web3.eth.Contract(Elonium.abi, "0x996eb07440580cf1B28213ceeD3112ec86500bb8")

  async function init() {
    setSupply(await elonium.methods.totalSupply().call());
    setBalance(await elonium.methods.balanceOf(account.address).call());
    setOwner(await elonium.methods.owner().call());
    setLoader(false);
  }

  init();

  // Transactions with an unspecified feeCurrency field will default to paying fees in CELO
  // const tx = await instance.methods.setName(newName).send({ from: account.address, feeCurrency: cUSDcontract.address })

  return (
    <div className="App">
      <header className="App-header">
        <h1>Elonium (ELM)</h1>

        <LoadingButton
          size="small"
          onClick={() => {
            setLoader(true);
            init();
          }}
          endIcon={<RefreshIcon />}
          loading={loader}
          loadingPosition="end"
          variant="outlined"
          style={{backgroundColor: "white", color: "black", border: 0}} 
        >
          Refresh
        </LoadingButton>
        <p>
          Total supply: {supply / 1e18} ELM <br /> <br />
          Account: {account.address} <br />
          Balance: {balance / 1e18} ELM <br />
        </p>
        {/* {<Button variant="outlined" onClick={connect}>Connect wallet</Button>} */}

        <Divider />

        {owner !== null && owner === account.address && <OwnerCard elonium={elonium}/>}
        {/* <button onClick={connect}>Click here to connect your wallet</button> */}
      </header>
    </div>
  )
}

function App() {
  return (
    <ContractKitProvider
      dapp={{
          name: "Elonium",
          description: "An ERC 20 token deployed on Alfajores",
          url: "",
        }}
    >
      <AppInside />
    </ContractKitProvider>
  );
}

export default App;