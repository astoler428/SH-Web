import React, {useEffect, useRef} from 'react'
import { useParams } from 'react-router'
import { UPDATE, Status, GameSettings } from '../consts'
import { socket } from '../socket'
import { useNavigate } from "react-router-dom";
import client, {post} from '../api/api';
import { Typography, Box, Toolbar, Button, AppBar } from '@mui/material';
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
        // enteringGameRef.current = true
        // navigate(`/game/${id}`)
        goToGame()
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

  const players = game?.players?.map((player, idx) =>
     <Typography
     key={player.name}
     variant='h6'
      sx={{marginBottom: {sm: '4px'}, whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: player.name === name ? 'bold' : 'normal'}}
    >
    {idx+1}. {player.name}
    </Typography>
  )

  const startGameButtonText = game?.players?.length < 5 ?
    `Waiting for more players` :
    game?.host === name ?  `Start Game` : `WAITING for ${game?.host} to start game`

  const disabled = !game || game?.players?.length < 5 || game?.host !== name

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game ID: {id}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <Box sx={{
        marginTop: {xs: '30px', sm: '10vh', md: '10vh', lg: '10vh'},
        display: 'flex',
        justifyContent: 'center',

        minHeight:"100vh",
      }}> */}
        <Box
          sx={{
            marginTop: {xs: '30px', sm: '10vh'},
            display:"flex",
            flexDirection: 'column',
            width:'100%',
            maxWidth: '320px',
            gap:{sx: 4, sm: 4, md: 3, lg: 4},
            border: '2px solid red'
          }}
        >
      <GameSettingsComponent game={game} name={name} handleSettingsChange={handleSettingsChange}/>
      {/* <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 320,
          width: '100%',
          gap: 1}}> */}
        <Typography variant='h5' sx={{display: 'block', fontFamily: 'inter'}}>Players: </Typography>
        {/* <ol style={{margin: '0', fontFamily: 'inter', paddingLeft: '20px'}}> */}
          {players}
        {/* </ol> */}
          <Button variant='contained' disabled={disabled} onClick={startGame}>{startGameButtonText}</Button>
        </Box>
        {/* </Box> */}
      {/* </Box> */}
    </>
  )
}
