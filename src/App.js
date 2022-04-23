import React, { useState } from 'react';
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { useContractKit, ContractKitProvider } from '@celo-tools/use-contractkit';
import Elonium from './contracts/Elonium.json';

import '@celo-tools/use-contractkit/lib/styles.css';
import './App.css';

function AppInside () {
  const [symbol, setSymbol] = useState("-");
  
  const { address, connect } = useContractKit()
  const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
  const kit = newKitFromWeb3(web3);
  let elonium = new kit.connection.web3.eth.Contract(Elonium.abi, "0x996eb07440580cf1B28213ceeD3112ec86500bb8")

  const init = async () => {
    setSymbol(await elonium.methods.symbol().call());
  }

  init();

  // Transactions with an unspecified feeCurrency field will default to paying fees in CELO
  // const tx = await instance.methods.setName(newName).send({ from: account.address, feeCurrency: cUSDcontract.address })

  return (
    <div className="App">
      <header className="App-header">
        <h3>Elonium</h3>
        <p>{address}</p>
        <p>Symbol: {symbol}</p>
        <button onClick={connect}>Click here to connect your wallet</button>
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