import React from 'react'
import { Role, Status, Vote, draws2, draws3 } from '../consts'
import client from '../api/api'

export default function Action({game, name, id}) {

  let action
  const isCurrentPres = game.currentPres === name
  const isCurrentChan = game.currentChan === name
  const thisPlayer = game.players.find(player => player.name === name)
  if(game.status === Status.CREATED){
    action = <div>Waiting for the game to start</div>
  }
  else if(game.status === Status.CHOOSE_CHAN){
    action = isCurrentPres ?
    <div>Choose an eligible chancellor </div> :
    <div> Waiting for {game.currentPres} to pick a chancellor</div>
  }
  else if(game.status === Status.VOTE && thisPlayer.alive){
    action =
    <>
      <button onClick={()=> handleVote(Vote.JA)} className={thisPlayer.vote === Vote.JA ? 'selected' : ''}>Ja</button>
      <button onClick={()=> handleVote(Vote.NEIN)} className={thisPlayer.vote === Vote.NEIN ? 'selected' : ''}>Nein</button>
    </>
  }
  else if(game.status === Status.PRES_DISCARD){
    action = isCurrentPres ?
    game.presCards.map(card => <button onClick={handlePresDiscard} key={Math.random()}>{card.color}</button>) :
    <div>Waiting for the {game.currentPres} to discard</div>
  }
  else if(game.status === Status.CHAN_PLAY || game.status === Status.VETO_DECLINED){
    action = isCurrentChan ?
    <>
      {game.chanCards.map(card => <button onClick={handleChanPlay} key={Math.random()}>{card.color}</button>)}
      {game.FascPoliciesEnacted === 5 && !(game.status === Status.VETO_DECLINED) && <button onClick={handleVetoRequest}>Request veto</button>}
    </> :
    <div>Waiting for {game.currentChan} to play</div>
  }
  else if(game.status === Status.CHAN_CLAIM){
    action = isCurrentChan ?
    [0,1,2].map((i) => <button onClick={handleChanClaim} key={Math.random()}>{draws2[i]}</button>) :
    <div>Waiting for the {game.currentChan} to claim</div>
  }
  else if(game.status === Status.PRES_CLAIM){
    action = isCurrentPres ?
    [0,1,2,3].map((i) => <button onClick={handlePresClaim} key={Math.random()}>{draws3[i]}</button>) :
    <div>Waiting for the {game.currentPres} to claim.</div>
  }
  else if(game.status === Status.INV){
    action = isCurrentPres ?
    <div>Choose a player to investigate </div> :
    <div>Waiting for {game.currentPres} to investigate</div>
  }
  else if(game.status === Status.INV_CLAIM){
    const currentPres = game.players.find(player => player.name === game.currentPres)
    const playerInvd = currentPres.investigations.slice(-1)[0]
    action = isCurrentPres ?
    <>
      <div>{playerInvd.name} is a {playerInvd.team}. Make your claim </div>
      <button onClick={()=> handleInvClaim(Role.LIB)} >Liberal</button>
      <button onClick={()=> handleInvClaim(Role.FASC)}>Fascist</button>
    </> :
    <div>Waiting for {game.currentPres} to claim investigation.</div>
  }
  else if(game.status === Status.SE){
    action = isCurrentPres ?
    <div>Choose a player to special elect</div> :
    <div>Waiting for {game.currentPres} to special elect</div>
  }
  else if(game.status === Status.GUN){
    action = isCurrentPres ?
    <div>Choose a player to shoot</div> :
    <div>Waiting for {game.currentPres} to shoot</div>
  }
  else if(game.status === Status.INSPECT_TOP3){
    action = isCurrentPres ?
    <>
    <div>Here are the top 3 policies in order. Make a claim. </div>
    {game.top3.map((card) => <label key={Math.random()}>{card.color}</label>)}
    {[0,1,2,3].map((i) => <button key={i} onClick={handleInspect3Claim}>{draws3[i]}</button>)}
    </> :
    <div>Waiting for {game.currentPres} to look at top 3</div>
  }
  //may not need this - in logs
  else if(game.status === Status.END_FASC || game.status === Status.END_LIB){
    const winners = game.status === Status.END_FASC ? "Fascists" : "Liberals"
    action = <div>Game over. {winners} win!</div>
  }
  else if(game.status === Status.VETO_REQUEST){
    action = isCurrentPres ?
    <>
    <div>{game.currentChan} requests a veto.</div>
     <button onClick={()=>handleVetoReply(true)}>Accept</button>
      <button onClick={()=>handleVetoReply(false)}>Decline</button>
    </>
     :
    <div>Waiting for {game.currentPres} to decide on veto</div>
  }



  async function handleVote(vote){
    try {
      await client.post(`/game/vote/${id}`, {name, vote})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handlePresDiscard(e){
    const cardColor = e.target.textContent
    try {
      await client.post(`/game/presDiscard/${id}`, {cardColor})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleChanPlay(e){
    const cardColor = e.target.textContent
    try {
      await client.post(`/game/chanPlay/${id}`, {cardColor})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handlePresClaim(e){
    const claim = e.target.textContent
    try {
      await client.post(`/game/presClaim/${id}`, {claim})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleChanClaim(e){
    const claim = e.target.textContent
    try {
      await client.post(`/game/chanClaim/${id}`, {claim})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleInvClaim(role){
    try {
      await client.post(`/game/invClaim/${id}`, {claim: role})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleInspect3Claim(e){
    const claim = e.target.textContent
    try {
      await client.post(`/game/inspect3Claim/${id}`, {claim})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleVetoRequest(){
    try {
      await client.post(`/game/vetoRequest/${id}`)
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  async function handleVetoReply(vetoAccepted){
    try {
      await client.post(`/game/vetoReply/${id}`, {vetoAccepted})
    }
    catch (err) {
      console.log(err.response.data.message)
    }
  }

  return (
    <div>
      {action}
    </div>
  )
}

