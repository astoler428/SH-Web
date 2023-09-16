import React from 'react'
import { Color, Role, Team, Status, Vote, draws2, draws3, GameType } from '../consts'
import {post} from '../api/api'

export default function Action({game, name, id, mySetMessage}) {

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

  function validDiscardDueToMixedRole(cardColor){
    if(game.settings.type !== GameType.MIXED_ROLES){
      return true
    }
    if(thisPlayer.team === Team.LIB && thisPlayer.role == Role.FASC){
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.BLUE || game.presCards.every(card => card.color === Color.RED)
    }
    else if(thisPlayer.team === Team.FASC && thisPlayer.role === Role.LIB){
      //fasc who has to play blue unless all red
      return cardColor === Color.RED || game.presCards.every(card => card.color === Color.BLUE)
    }
    return true
  }

  function validPlayDueToMixedRole(cardColor){
    if(game.settings.type !== GameType.MIXED_ROLES){
      return true
    }
    if(thisPlayer.team === Team.LIB && thisPlayer.role == Role.FASC){
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.RED || game.chanCards.every(card => card.color === Color.BLUE)
    }
    else if(thisPlayer.team === Team.FASC && thisPlayer.role == Role.LIB){
      //fasc who has to play blue unless all red
      return cardColor === Color.BLUE || game.chanCards.every(card => card.color === Color.RED)
    }
    return true
  }


  async function handleVote(vote){
    await post(`/game/vote/${id}`, {name, vote})
  }

  async function handlePresDiscard(e){
    const cardColor = e.target.textContent
    if(validDiscardDueToMixedRole(cardColor)){
      await post(`/game/presDiscard/${id}`, {cardColor})
    }
    else{
      mySetMessage(`You cannot discard a ${cardColor}`)
    }
  }

  async function handleChanPlay(e){
    const cardColor = e.target.textContent
    if(validPlayDueToMixedRole(cardColor)){
      await post(`/game/chanPlay/${id}`, {cardColor})
    }
    else{
      mySetMessage(`You cannot play a ${cardColor}`)
    }
  }

  async function handlePresClaim(e){
    const claim = e.target.textContent
    await post(`/game/presClaim/${id}`, {claim})
  }

  async function handleChanClaim(e){
    const claim = e.target.textContent
    await post(`/game/chanClaim/${id}`, {claim})
  }

  async function handleInvClaim(role){
    await post(`/game/invClaim/${id}`, {claim: role})
  }

  async function handleInspect3Claim(e){
    const claim = e.target.textContent
    await post(`/game/inspect3Claim/${id}`, {claim})
  }

  async function handleVetoRequest(){
    await post(`/game/vetoRequest/${id}`)
  }

  async function handleVetoReply(vetoAccepted){
    await post(`/game/vetoReply/${id}`, {vetoAccepted})
  }

  return (
    <div>
      {action}
    </div>
  )
}

