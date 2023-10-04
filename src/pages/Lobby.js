import React, {useEffect, useRef} from 'react'
import { useParams } from 'react-router'
import { UPDATE, Status, GameType, GameSettings } from '../consts'
import { socket } from '../socket'
import { useNavigate } from "react-router-dom";
import client, {post} from '../api/api';
import { Typography, Box, Toolbar, IconButton, Button, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import GameSettingsComponent from '../components/GameSettingsComponent';

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
        console.log(err?.response?.data?.message)
        navigate('/')
      }
    }
  }, [id, name, navigate, setGame, isConnected])

  //click listener to start the game - a socket message update comes in causing navigation
  async function startGame(){
    if(game.host === name){
      await post(`/game/start/${id}`)
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


  async function handleSettingsChange(propName, propValue){
    if(game.host === name){
      propValue = propName === GameSettings.TYPE ? propValue : !game.settings[propName]
      await post(`/game/settings/${id}`, {gameSettings: {...game.settings, [propName]: propValue}})
    }
  }

  const renderPlayerName = _name => _name === name ? _name + ` (YOU)` : _name

  const players = game?.players?.map(player => <li key={player.name}>
     <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
    >
      {renderPlayerName(player.name)}
    </Box>
  </li>)

  const startGameButtonText = game?.players?.length < 5 ?
    `Waiting for more players` :
    game?.host === name ?  `Start Game` : `WAITING for ${game?.host} to start game`

  const disabled = !game || game?.players?.length < 5 || game?.host !== name
  return (
    <>
    {game?.status === Status.CREATED ?
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game ID: {id}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{
        marginTop: {xs: '50px', sm: '100px'},
        display: 'flex',
        justifyContent: 'center',
        minHeight:"100vh",
      }}>
        <Box
          sx={{
            display:"flex",
            flexDirection:"column",
            // flexWrap:"wrap",
            width:320,
            gap:4
          }}
        >
      <GameSettingsComponent game={game} name={name} handleSettingsChange={handleSettingsChange}/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1}}>
        <Typography variant='h4' sx={{display: 'block'}}>Players: </Typography>
        <ol>
          {players}
        </ol>
        <Button variant='contained' disabled={disabled} onClick={startGame}>{startGameButtonText}</Button>
        </Box>
        </Box>
      </Box>
    </> :
    <Button onClick={goToGame}>Go to game</Button> }

    </>
  )
}
