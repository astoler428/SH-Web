import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router'
import client from '../api/api'
import { socket } from '../socket'
import {Status, UPDATE} from '../consts'
import Players from '../components/Players';
import Board from '../components/Board';
import Action from '../components/Action';

export default function Game({name, game, setGame, isConnected}) {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  //redundant join by just in case someone navigates directly or refreshes page
  useEffect(()=>{
    if(isConnected){
      joinGame()
    }
    async function joinGame(){
      try {
        await client.post(`/game/join/${id}`, {name, socketId: socket.id})
      }
      catch (err) {
        console.log(err.response.data.message)
        navigate('/')
      }
    }
  }, [id, name, navigate, setGame, isConnected])


  //listen for updates - this is what will cause component to rerender and display everything appropriately
  useEffect(()=>{
    socket.on(UPDATE, (game) => setGame(game))

    function leaveGame(){
      client.post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: false})
    }

    return () => {
      socket.off(UPDATE, (game) => setGame(game));
      leaveGame()
    };
  }, [id, navigate, setGame]) //will these be an issue causing dismout and leave game to be called?


  return (
      <>
    {game && game.status !== Status.CREATED ?
    <div>
      <label> Game has started</label>
      <label> GameId: {id} </label>
      <Players game={game}/>
      <Board game={game}/>
      <Action/>
    </div>
    : <div>Loading</div>
     }
    </>
  )
}
