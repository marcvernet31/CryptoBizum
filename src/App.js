import * as React from 'react';
import { useState, useEffect } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ethers } from 'ethers'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const LoginPage = ({connectWallet}) => {
  return(
    <Box
    sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
    >
      <Box sx={{ p: 3}} textAlign="center">
        <img
          width="400" 
          src="name.png"
          alt="title"
          loading="lazy"
        />
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={connectWallet}
      >
        Connect Wallet
      </Button>
      
    </Box>
  )
}

const TransactionDialog = ({open, setOpen}) => {
  return(
    <Dialog
    open={open}
    onClose={() => setOpen(false)}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Transaction sent!"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Transaction has been sent successfully. It will be received in some seconds
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpen(false)} autoFocus>
        OK
      </Button>
    </DialogActions>
  </Dialog>
  )
}

const TransactionPage = ({currentAccount}) => {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const payment = async({setError, ether, addr}) => {
    try{
      setSending(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether)
      });
      // Transaction finished
      setSending(false)
      setOpen(true);
    } catch(error){
      setError(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await payment({
      setError,
      ether: data.get("ether"),
      addr: data.get("addr")
    });
  };

  return(
    <Box
    sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: '1px dashed grey'
    }}
  >

    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      <SendIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
      Send ETH payment
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="addr"
        label="Recipient Address"
        name="addr"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="ether"
        label="Ammount in ETH"
        type="number"
        id="ether"
        autoComplete="current-password"
      />
      {sending ? (
        <LoadingButton
          loading
          fullWidth
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Sending
        </LoadingButton>
      ):(
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          PAY NOW
        </Button>
      )}
    </Box>
   <TransactionDialog open={open} setOpen={setOpen}/>
  </Box>
  )
}

const theme = createTheme();

export default function SignIn() {

  const [currentAccount, setCurrentAccount] = useState('')

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // User can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {currentAccount !== '' ? (
         <TransactionPage currentAccount={currentAccount}/>

        ):(
          <LoginPage connectWallet={connectWallet}/>
    
        )}
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}




// https://codesandbox.io/s/react-eth-metamask-7vuy7?file=/src/App.js
