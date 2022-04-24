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

export default function OwnerCard(el) {
  const [tempDialog, setTempDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [mintDialog, setMintDialog] = useState(false);
  const [transDialog, setTransDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);

  const [mintValue, setMintValue] = useState(0);
  const [transFromAddress, setTransFromAddress] = useState(null);
  const [transToAddress, setTransToAddress] = useState(null);
  const [transAmount, setTransAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState(0);

  const { address } = useContractKit();
  const elonium = el.elonium;

  async function transfer() {
    if (transAmount <= 0)
      return;
    if (transFromAddress == null)
      setTransFromAddress(address);
    await elonium.methods.transferFrom(transFromAddress, transToAddress, (transAmount * 1e18).toString())
      .send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  function setDialog(obj) {
    setDialogMessage(JSON.stringify(obj));
    setTempDialog(true);
  }

  async function burnAllTokens() {
    await elonium.methods.burnAllTokens().send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  async function addReceiver() {
    await elonium.methods.addReceiver(receiverAddress).send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  async function removeReceiver() {
    await elonium.methods.removeReceiver(receiverAddress).send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  async function mintTokens() {
    if (mintValue <= 0)
      return;
    await elonium.methods.mint(address, (mintValue * 1e18).toString()).send({ from: address, gas: 1e6 })
      .then(setDialog)
      .catch(setDialog);
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Exclusive Owner Features
        </Typography>
        <Button onClick={burnAllTokens} style={{ marginTop: "10px" }} size="small" variant="contained" color="error">BURN ALL TOKENS</Button> 
        <br />
        
        <Button onClick={() => setMintDialog(true)} style={{ marginTop: "10px" }} size="small" variant="contained" color="success">MINT NEW TOKENS</Button>
        <Dialog open={mintDialog} onClose={() => setMintDialog(false)}>
          <DialogTitle>Mint New Tokens</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the amount of tokens to mint
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="ELM tokens"
              fullWidth
              variant="standard"
              onChange={(e) => setMintValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {mintTokens(); setMintDialog(false)}} variant="outlined">Mint</Button>
            <Button onClick={() => setMintDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <br />
        
        <Button onClick={() => setAddressDialog(true)} style={{ marginTop: "10px" }} size="small" variant="contained" color="success">MODIFY RECEIVERS</Button>
        <Dialog open={addressDialog} onClose={() => setMintDialog(false)}>
          <DialogTitle>Add/remove eligible receivers</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Modify the list of eligible receivers by adding/removing an address
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="Address"
              fullWidth
              variant="standard"
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {addReceiver(); setAddressDialog(false)}} variant="outlined">Add</Button>
            <Button onClick={() => {removeReceiver(); setAddressDialog(false)}} variant="outlined">Remove</Button>
            <Button onClick={() => setAddressDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <br />

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
              label="From Address"
              fullWidth
              variant="standard"
              onChange={(e) => setTransFromAddress(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="mint-amount"
              label="To Address"
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
