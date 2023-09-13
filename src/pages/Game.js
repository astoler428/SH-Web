import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router'
import client from '../api/api'
import { socket } from '../socket'
import {Status, UPDATE} from '../consts'
import Players from '../components/Players';
import Board from '../components/Board';
import Action from '../components/Action';
import Log from '../components/Log';
import Loading from '../components/Loading';

export default function Game({name, game, setGame, isConnected}) {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const isCurrentPres = game?.currentPres === name
  const thisPlayer = game?.players.find(player => player.name === name)
  let message = ""

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

    async function leaveGame(){
      try {
        await client.post(`/game/leave/${id}`, {socketId: socket.id, enteringGame: false})
      } catch (err) {
        console.log(err.response.data.message)
      }
    }
    return () => {
      socket.off(UPDATE, (game) => setGame(game));
      leaveGame()
    };
  }, []) //will these be an issue causing dismout and leave game to be called?

  function handleChoosePlayer(e){
    let chosenName = e.target.textContent
    let chosenPlayer = game.players.find(player => player.name === chosenName)
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
      message = 'You must choose an eligible chancellor.'
      return
    }
    try {
      await client.post(`/game/chooseChan/${id}`, {chanName: chosenPlayer.name})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleChooseInv(chosenPlayer){
    if(chosenPlayer.investigated){
      message = "This player has already been investigated."
      return
    }
    try {
      await client.post(`/game/chooseInv/${id}`, {invName: chosenPlayer.name})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleChooseSE(chosenPlayer){
    try {
      await client.post(`/game/chooseSE/${id}`, {seName: chosenPlayer.name})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleChooseGun(chosenPlayer){
    try {
      await client.post(`/game/chooseGun/${id}`, {shotName: chosenPlayer.name})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  return (
      <>
    {game && game.status !== Status.CREATED ?
    <div>
      <label> GameId: {id} </label>
      <div>Name: {name}</div>
      <div>Role: {thisPlayer.role}</div>
      <Players name={name} game={game} handleChoosePlayer={handleChoosePlayer}/>
      <Board game={game}/>
      <Action game={game} name={name} id={id}/>
      <Log game={game}/>
      <div>{message}</div>
    </div>
    : <Loading/>
     }
    </>
  )
}
