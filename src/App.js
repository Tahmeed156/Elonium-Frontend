import React, { useState } from 'react';
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { ContractKitProvider } from '@celo-tools/use-contractkit';
import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Grid';

import Elonium from './contracts/Elonium.json';
import Lori from './contracts/Lori.json';
import OwnerCard from './components/OwnerCard';
import UserCard from './components/UserCard';

import '@celo-tools/use-contractkit/lib/styles.css';
import './App.css';
import { Divider } from '@mui/material';

function AppInside () {
  const [supply, setSupply] = useState(0);
  const [balance, setBalance] = useState(0);
  const [owner, setOwner] = useState(null);
  const [loader, setLoader] = useState(false);
  const [receivers, setReceivers] = useState(null);
  const [nfts, setNfts] = useState(0);
  
  // const { address, connect } = useContractKit()
  const web3 = new Web3(process.env.REACT_APP_CELO_NODE)
  const kit = newKitFromWeb3(web3); 
  const account = web3.eth.accounts.privateKeyToAccount(process.env.REACT_APP_PRIVATE_KEY);
  kit.connection.addAccount(account.privateKey);
  kit.defaultAccount = account.address;
  let elonium = new kit.connection.web3.eth.Contract(Elonium.abi, process.env.REACT_APP_ELM_CONTRACT_ADDRESS)
  let lori = new kit.connection.web3.eth.Contract(Lori.abi, process.env.REACT_APP_LORI_CONTRACT_ADDRESS)

  async function init() {
    setSupply(await elonium.methods.totalSupply().call());
    setBalance(await elonium.methods.balanceOf(account.address).call());
    setOwner(await elonium.methods.owner().call());
    setReceivers(await elonium.methods.getReceivers().call());
    setNfts(await lori.methods.balanceOf(account.address).call());
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
          NFTs owned: {nfts} LORI <br />
        </p>
        <ul style={{ listStyle: "none" }}>
          <li>Eligible Receivers:</li>
          {receivers !== null && receivers.map((item, i) => {
            return item !== "0x0000000000000000000000000000000000000000" && <li key={i}>{item}</li>;
          })}
        </ul> <br />
        {/* {<Button variant="outlined" onClick={connect}>Connect wallet</Button>} */}

        <Divider />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} spacing={4}
          direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={3}>
            <UserCard elonium={elonium} lori={lori} kit={kit} acc={account} />
          </Grid>
          <Grid item xs={3}>
            {owner !== null && owner === account.address && <OwnerCard elonium={elonium}/>}
          </Grid>
        </Grid>

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