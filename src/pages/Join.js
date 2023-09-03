import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import client from '../api/api'
import { socket } from '../socket'
import { Status } from '../consts'

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
      setError(err.response.data.message)
    }
  }

  return (
    <div>
      <input placeholder="Game ID" value={id} onChange={(e)=>setId(e.target.value)} />
      <button disabled={id.length !== 4} onClick={handleJoin}>Join Game</button>
      <div>{error}</div>
    </div>
  )
}
