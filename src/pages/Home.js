import React, {useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import { socket } from '../socket';
import client from '../api/api'
import {Typography, CssBaseline, Box, TextField, Button} from '@mui/material'

export default function Home({name, setName, isConnected, setIsLoading}) {
  const navigate = useNavigate();
  const nameInputRef = useRef()

  async function createGame(){
    try {
      setIsLoading(true)
      const res = await client.post('/game', {name, socketId: socket.id})
      setIsLoading(false)
      const id = res.data
      navigate(`/lobby/${id}`)
    } catch (err) {
      setIsLoading(false)
      console.log(err.response?.data.message)
    }
  }

  function handleInputChange(e){
    localStorage.setItem("USER", e.target.value)
    setName(e.target.value)
  }

  useEffect(()=>{
    nameInputRef.current.focus()
    nameInputRef.current.select()
  }, [])

  return (
      <>
      {/* <Box sx={{
        position: 'absolute',
        left: 12,
        top: 12
      }}> */}
        <Typography sx={{
          position: 'absolute',
          left: 12,
          top: 12}}>
          {isConnected ? '🟢' : '🔴'}
        </Typography>
        <Typography sx={{
          position: 'absolute',
          left: 30,
          top: 11}}>
          {isConnected ? 'online' : 'offline'}
        </Typography>
      {/* </Box> */}
      <CssBaseline />
        <Box
        sx={{
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          minHeight:"100vh"
        }}
        >
          <Box
            sx={{
              display:"flex",
              flexDirection:"row",
              flexWrap:"wrap",
              width:320,
              gap:2
              }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                required
                inputRef={nameInputRef}
                label='Name'
                fullWidth
                value={name}
                onChange={handleInputChange} />
              <Button
                type='submit'
                disabled={!name}
                onClick={createGame}
                fullWidth
                variant='contained'
                sx={{margin: '8px 0 4px 0'}}>
                  Create Game
              </Button>
              <Button
                disabled={!name}
                onClick={()=> navigate('/join')}
                variant='outlined'
                fullWidth>
                  Join Game
              </Button>
            </form>
          </Box>
        </Box>
    </>
  )
}

