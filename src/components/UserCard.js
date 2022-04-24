import React, { useState } from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function UserCard(props) {
  const [tempDialog, setTempDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [transDialog, setTransDialog] = useState(false);
  const [buyElm, setBuyElm] = useState(false);

  const [transToAddress, setTransToAddress] = useState(null);
  const [transAmount, setTransAmount] = useState(0);
  const [amount, setAmount] = useState(0);

  const { address } = useContractKit();
  const elonium = props.elonium;
  const lori = props.lori;
  const kit = props.kit;
  const acc = props.acc;

  async function buyElmTrans() {
    if (amount <= 0)
      return;
    await kit.connection.sendTransaction({
      from: acc.address, 
      to: process.env.REACT_APP_ELM_CONTRACT_ADDRESS,
      value: (amount * 1e18).toString(),
      gas: 1e6
    });
  }

  async function mintLori() {
    await elonium.methods.receiverExists(process.env.REACT_APP_LORI_CONTRACT_ADDRESS).call()
      .then(async (val) => {
        if (!val) {
          await elonium.methods.addReceiver(process.env.REACT_APP_LORI_CONTRACT_ADDRESS).send({ from: address, gas: 1e6 });
        }
      });
    await elonium.methods.approve(process.env.REACT_APP_LORI_CONTRACT_ADDRESS, (100 * 1e18).toString())
      .send({ from: acc.address, gas: 1e6 })
      .then(
        await lori.methods.safeMint()
          .send({ from: acc.address, gas: 1e6 })
          .then(setDialog)
          .catch(setDialog)
      )
      .catch(setDialog);
  }

  async function transfer() {
    if (transAmount <= 0)
      return;
    await elonium.methods.transfer(transToAddress, (transAmount * 1e18).toString()).send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  function setDialog(obj) {
    setDialogMessage(JSON.stringify(obj));
    setTempDialog(true);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          User Features
        </Typography>

        <Button onClick={() => setTransDialog(true)} style={{ marginTop: "10px" }} size="small" variant="contained" color="primary">TRANSFER TOKEN</Button>
        <Dialog open={transDialog} onClose={() => setTransDialog(false)}>
          <DialogTitle>Transfer Tokens</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the amount of tokens to transfer to a particular address
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="Address"
              fullWidth
              variant="standard"
              onChange={(e) => setTransToAddress(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="ELM tokens"
              fullWidth
              variant="standard"
              onChange={(e) => setTransAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {transfer(); setTransDialog(false)}} variant="outlined">Transfer</Button>
            <Button onClick={() => setTransDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <br />

        <Button onClick={() => setBuyElm(true)} style={{ marginTop: "10px" }} size="small" variant="contained" color="success">BUY ELM</Button>
        <Dialog open={buyElm} onClose={() => setBuyElm(false)}>
          <DialogTitle>Buy ELM using CELO</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the amount of CELO in invest (Rate = 0.01 CELO / ELM)
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="CELO"
              fullWidth
              variant="standard"
              onChange={(e) => setAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {buyElmTrans(); setBuyElm(false)}} variant="outlined">Buy</Button>
            <Button onClick={() => setBuyElm(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <br />

        <Button onClick={() => mintLori()} style={{ marginTop: "10px" }} size="small" variant="contained" color="success">MINT LORI</Button>

        <Dialog
          open={tempDialog}
          scroll="paper"
          onClose={() => setTempDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Trasaction result"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTempDialog(false)}>Ok</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
}
