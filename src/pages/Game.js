import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router'
import client, {post} from '../api/api'
import { socket } from '../socket'
import {GameType, Status, UPDATE} from '../consts'
import Players from '../components/Players';
import Board from '../components/Board';
import Log from '../components/Log';
import Loading from '../components/Loading';
import Chat from '../components/Chat';
import { Typography, IconButton, Snackbar, AppBar, Toolbar, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RoleModal from '../components/RoleModal';
import ConfirmFascDialog from '../components/ConfirmFascDialog';

export default function Game({name, game, setGame, isConnected}) {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const isCurrentPres = game?.currentPres === name
  const thisPlayer = game?.players.find(player => player.name === name)
  const [message, setMessage] = useState("")
  const [roleOpen, setRoleOpen] = useState(false);
  const [confirmFascOpen, setConfirmFascOpen] = useState(false)
  const [error, setError] = useState(null)


  const mySetMessage = (newMessage) => {
    setMessage(newMessage)
    setTimeout(()=> setMessage(""), 2000)
  }

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
        console.log(err?.response?.data?.message)
        navigate('/')
      }
    }
  }, [id, name, navigate, setGame, isConnected])


  //listen for updates - this is what will cause component to rerender and display everything appropriately
  useEffect(()=>{
    socket.on(UPDATE, (game) => setGame(game))

    async function leaveGame(){
      await post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: false})
    }
    return () => {
      socket.off(UPDATE, (game) => setGame(game));
      leaveGame()
    };
  }, []) //will these be an issue causing dismout and leave game to be called?

  function handleChoosePlayer(e){
    const card = e.target.closest('.MuiCard-root');
    let chosenName = card.getAttribute('data-key')
    let chosenPlayer = game.players.find(player => player.name === chosenName)
    //perhaps in blind version you can choose yourself to inv
    if(!isCurrentPres || chosenPlayer.name === thisPlayer.name || !chosenPlayer.alive){
      return
    }
    if(game.status === Status.CHOOSE_CHAN){
      handleChooseChan(chosenPlayer)
    }
    else if(game.status === Status.INV){
      handleChooseInv(chosenPlayer)
    }
    else if(game.status === Status.SE){
      handleChooseSE(chosenPlayer)
    }
    else if(game.status === Status.GUN){
      handleChooseGun(chosenPlayer)
    }
  }

  async function handleChooseChan(chosenPlayer){
    if(chosenPlayer.name === game.prevPres || chosenPlayer.name === game.prevChan){
      mySetMessage('You must choose an eligible chancellor.')
      return
    }
    await post(`/game/chooseChan/${id}`, {chanName: chosenPlayer.name})
  }

  async function handleChooseInv(chosenPlayer){
    if(chosenPlayer.investigated){
      mySetMessage("This player has already been investigated.")
      return
    }
    await post(`/game/chooseInv/${id}`, {invName: chosenPlayer.name})
  }

  async function handleChooseSE(chosenPlayer){
    await post(`/game/chooseSE/${id}`, {seName: chosenPlayer.name})
  }

  async function handleChooseGun(chosenPlayer){
    await post(`/game/chooseGun/${id}`, {shotName: chosenPlayer.name})
  }

  async function handleConfirmFasc(){
    //show dialog box
    // if(window.confirm("Are you sure? If you are wrong, the liberals lose.")){
      await post(`/game/confirmFasc/${id}`, {name: thisPlayer.name})
    // }
  }

  useEffect(() => {
    if(game?.status === Status.END_FASC || game?.status === Status.END_LIB){
      setRoleOpen(false)
    }
  }, [game])

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={()=> setError(null)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
      <>
    {game && game.status !== Status.CREATED ?
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game ID: {id}
          </Typography>
          <Button color="inherit" onClick={() => setRoleOpen(true)}>Role</Button>
          <RoleModal thisPlayer={thisPlayer} game={game} roleOpen={roleOpen} setRoleOpen={setRoleOpen} setConfirmFascOpen={setConfirmFascOpen} />
        </Toolbar>
      </AppBar>
      <div style={{marginTop: '64px'}}>

      </div>
      <Board game={game} name={name} id={id} setError={setError}/>
      <Players name={name} game={game} handleChoosePlayer={handleChoosePlayer}/>
      <div>{message}</div>
      <Log game={game}/>
      <Chat game={game} name={name}/>
      <Snackbar
        open={error !== null}
        onClose={() => setError(null)}
        message={error}
        autoHideDuration={5000}
        action={action}
      />
      <ConfirmFascDialog confirmFascOpen={confirmFascOpen} setConfirmFascOpen={setConfirmFascOpen} handleConfirmFasc={handleConfirmFasc}/>
    </>
    : <Loading />
     }
    </>
  )
}


/**
 * currently showing role on blind to see
 * currently only 1 vote and it either passes or fails
 */