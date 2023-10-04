import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import client from '../api/api'
import { socket } from '../socket'
import { Status } from '../consts'
import {Typography, CssBaseline, IconButton, Snackbar, Box, TextField, Button} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

export default function Join({name, setIsLoading}) {
  const navigate = useNavigate();
  const [id, setId] = useState("")
  const [error, setError] = useState(null)


  async function handleJoin(){
    try {
      setIsLoading(true)
      const res = await client.post(`/game/join/${id}`, {name, socketId: socket.id})
      setIsLoading(false)
      const game = res.data
      if(game.status === Status.CREATED){
        navigate(`/lobby/${id}`)
      }
      else{
        navigate(`/game/${id}`)
      }
    } catch (err) {
      setIsLoading(false)
      setError(err?.response?.data?.message)
    }
  }

  const handleClose = () => setError(null)

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Box sx={{
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        width:320,
        gap:2
      }}>
        <TextField
          autoFocus
          label="Game ID"
          value={id}
          onChange={(e)=>setId(e.target.value.toUpperCase())}
          fullWidth
          required
          />
        <Button
          fullWidth
          variant='contained'
          disabled={id.length !== 4}
          onClick={handleJoin}
          >
            Join Game
        </Button>
      </Box>
      <Snackbar
        open={error !== null}
        onClose={handleClose}
        message={error}
        autoHideDuration={5000}
        action={action}
      />
    </Box>
  )
}
