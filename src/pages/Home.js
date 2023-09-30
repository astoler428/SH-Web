import React, {useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import { socket } from '../socket';
import client from '../api/api'
import {Typography, CssBaseline, Container} from '@mui/material'

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
      <CssBaseline />
      <Container maxWidth="sm">
        <label>{isConnected ? `Connected` : `Not connected`}</label>
        <input ref={nameInputRef} placeholder="Name" value={name} onChange={handleInputChange} />
        <button disabled={!name} onClick={createGame}>Create Game</button>
        <button disabled={!name} onClick={()=> navigate('/join')}>Join Game</button>
      </Container>
    </>
  )
}

