import React, {useEffect, useRef} from 'react'
import { useParams } from 'react-router'
import { UPDATE, Status, GameType, GameSettings } from '../consts'
import { socket } from '../socket'
import { useNavigate } from "react-router-dom";
import client, {post} from '../api/api';

export default function Lobby({name, game, setGame, isConnected}) {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const enteringGameRef = useRef(false)
  // const [gameSettings, setGameSettings] = useState({type: GameType.BLIND, libSpy: false, redDown: false, hitlerKnowsFasc: false})

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
      await post(`/game/start/${id}`)

      // try {
      //   await client.post(`/game/start/${id}`)
      // } catch (err) {
      //   console.log(err)
      // }
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
    async function leaveGame(){
      await post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: enteringGameRef.current})
      // try {
      //   await client.post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: enteringGameRef.current})
      // }
      // catch (err) {
      //   console.log(err.response.data.message)
      // }
    }

    return () => {
      socket.off(UPDATE, handleUpdate)
      leaveGame()
    };
  }, []) //will these be an issue causing dismout and leave game to be called?


  //don't think this will ever get used since they should always get navigated to game
  function goToGame(){
    enteringGameRef.current = true
    navigate(`/game/${id}`)
  }

  const players = game?.players?.map(player => <li key={Math.random()}>{player.name}</li>)

  async function handleSettingsChange(propName, propValue){
    if(game.createdBy === name){
      propValue = propName === GameSettings.TYPE ? propValue : !game.settings[propName]
      await post(`/game/settings/${id}`, {gameSettings: {...game.settings, [propName]: propValue}})
  }
}

//change handleSettingsChange
  return (
    <>
    {game?.status === Status.CREATED ?
    <div>
      <label>GameId: {id} </label>
      <br/>
      <label htmlFor='gameType'>Choose Game Type:</label>
      <select name='gameType' value={game.settings.type} onChange={(e)=> handleSettingsChange(GameSettings.TYPE, e.target.value)}>
        <option>{GameType.BLIND}</option>
        <option>{GameType.NORMAL}</option>
        <option>{GameType.LIB_SPY}</option>
        <option>{GameType.MIXED_ROLES}</option>
    </select>


      <label> Begin with red on board
        <input type="checkbox" checked={game.settings?.redDown} onChange={(e)=> handleSettingsChange(GameSettings.REDDOWN)}/>
      </label>
      { game.settings?.type !== GameType.BLIND &&
      <>
        <label> Hitler knows fasc in 7+
          <input type="checkbox" checked={game.settings?.hitlerKnowsFasc} onChange={(e)=> handleSettingsChange(GameSettings.HITLERKNOWSFASC)}/>
        </label>
      </>
    }
      <br/>
      <label>Players:</label>
      <ol>
        {players}
      </ol>
      <button disabled={!game || game.players?.length < 5} onClick={startGame}>Start Game</button>
    </div> :
    <button onClick={goToGame}>Go to game</button> }

    </>
  )
}
