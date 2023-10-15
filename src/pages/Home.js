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

  return (
    <>
    {/* <Box sx={{maxWidth: 600, opacity: 1}}>
     <Box sx={{position: 'relative', width: 600, height: 600}}>
    <Box style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
      <Box sx={{width: '100%'}}>
        <Typography sx={{width: '100%', fontSize: '25px', textAlign: 'center'}}>CHOOSE A POLICY TO PLAY</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap:4, justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{height: '100%', display: 'flex'}}>
        <img src={libPolicy} style={{width: POLICY_WIDTH, borderRadius: '10px', cursor: 'pointer' }}/>
      </Box>
      <Box sx={{height: '100%', display: 'flex'}}>
        <img src={libPolicy} style={{width: POLICY_WIDTH, borderRadius: '10px', cursor: 'pointer' }}/>
      </Box>
      <Box sx={{height: '100%', display: 'flex'}}>
        <img src={libPolicy} style={{width: POLICY_WIDTH, borderRadius: '10px', cursor: 'pointer' }}/>
      </Box>

      </Box>
    </Box>
    </Box>
    </Box> */}
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

