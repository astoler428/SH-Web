import React, {useState, useRef, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import client from '../api/api'
import { socket } from '../socket'
import { Status } from '../consts'

export default function Join({name, setIsLoading}) {
  const navigate = useNavigate();
  const [id, setId] = useState("")
  const [error, setError] = useState(null)
  const gameIdInputRef = useRef()


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

  useEffect(()=>{
    gameIdInputRef.current.focus()
  },[])

  return (
    <div>
      <input ref={gameIdInputRef} placeholder="Game ID" value={id} onChange={(e)=>setId(e.target.value)} />
      <button disabled={id.length !== 4} onClick={handleJoin}>Join Game</button>
      <div>{error}</div>
    </div>
  )
}
