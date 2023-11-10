import React, {useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import { socket } from '../socket';
import client from '../api/api'
import {Typography, CssBaseline, Box, TextField, Button} from '@mui/material'
import PolicyBack from '../components/PolicyBack';
import LibPolicy from '../components/LibPolicy';
import FascPolicy from '../components/FascPolicy';
import VoteCard from '../components/VoteCard';
import Tracker from '../components/Tracker';
import PolicyBoard from '../components/PolicyBoard';
import Loading from '../components/Loading';
import { Role, Vote, POLICY_WIDTH } from '../consts';
import libPolicy from '../img/LibPolicy.png'
import fascPolicy from '../img/FascPolicy.png'

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

  // ref={nameInputRef}
  useEffect(()=>{
    nameInputRef.current.focus()
    nameInputRef.current.select()
  }, [])

  // const playerColors = ['blueViolet','magenta', 'orange', 'yellowGreen', 'darkgreen']
  // const playerColors = ['#50C878', '#9c51b6', '#FF7F50','teal']
  return (
      <>
      <Box sx={{
        position: 'absolute',
        left: 12,
        top: 12
      }}>
        <Typography>
        {isConnected ? '🟢 online' : '🔴 offline'}
        </Typography>
      </Box>
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
                variant='contained'>
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

