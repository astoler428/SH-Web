import React from 'react'
import { useNavigate } from "react-router-dom";
import { socket } from '../socket';
import client from '../api/api'

export default function Home({name, setName, isConnected, setIsLoading}) {
  const navigate = useNavigate();

  async function createGame(){
    try {
      setIsLoading(true)
      const res = await client.post('/game', {name, socketId: socket.id})
      setIsLoading(false)
      const id = res.data
      navigate(`/lobby/${id}`)
    } catch (err) {
      setIsLoading(false)
      throw new Error(err.response.data.message)
    }
  }

  function handleInputChange(e){
    localStorage.setItem("USER", e.target.value)
    setName(e.target.value)
  }

  return (
    <div>
      <label>{isConnected ? `Connected` : `Not connected`}</label>
      <input placeholder="Name" value={name} onChange={handleInputChange} />
      <button disabled={!name} onClick={createGame}>Create Game</button>
      <button disabled={!name} onClick={()=> navigate('/join')}>Join Game</button>
    </div>
  )
}

