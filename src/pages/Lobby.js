import React, {useEffect, useRef} from 'react'
import { useParams } from 'react-router'
import { UPDATE, Status, GameType } from '../consts'
import { socket } from '../socket'
import { useNavigate } from "react-router-dom";
import client from '../api/api';

export default function Lobby({name, game, setGame, isConnected}) {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const enteringGameRef = useRef(false)

  //join game (redundant but just in case someone navigates directly to the url)
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

  //click listener to start the game - a socket message update comes in causing navigation
  async function startGame(){
    if(game.createdBy === name){
      try {
        await client.post(`/game/start/${id}`)
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  //listening for updates - in lobby the only updates are the players gotten from the updated game obj
  // and whether or not to join the game
  useEffect(()=>{
    socket.on(UPDATE, handleUpdate)

    function handleUpdate(game){
      setGame(game)
      if(game && game.status !== Status.CREATED){
        enteringGameRef.current = true
        navigate(`/game/${id}`)
      }
    }

    //called on cleanup - if leaving the lobby (takes into account may be leaving lobby to enter game)
    function leaveGame(){
      client.post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: enteringGameRef.current})
    }

    return () => {
      socket.off(UPDATE, handleUpdate)
      leaveGame()
    };
  }, [id, navigate, setGame]) //will these be an issue causing dismout and leave game to be called?


  //don't think this will ever get used since they should always get navigated to game
  function goToGame(){
    enteringGameRef.current = true
    navigate(`/game/${id}`)
  }

  const players = game?.players?.map(player => <li key={Math.random()}>{player.name}</li>)

  function handleGameTypeChange(){
    if(game.createdBy === name){
      client.post(`/game/gameType/${id}`, {gameType: game.gameType === GameType.BLIND ? GameType.NORMAL : GameType.BLIND})
    }
  }

  console.log(game?.gameType)

  return (
    <>
    {game?.status === Status.CREATED ?
    <div>
      <label>GameId: {id} </label>
      <br/>
      <label> Blind
        <input type="checkbox" checked={game.gameType === GameType.BLIND} onChange={handleGameTypeChange}/>
      </label>
      <br/>
      <label>Players:</label>
      <ol>
        {players}
      </ol>
      <button disabled={!game || game.players?.length < 1} onClick={startGame}>Start Game</button>
    </div> :
    <button onClick={goToGame}>Go to game</button> }
    </>
  )
}
