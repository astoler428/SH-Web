import React from 'react'
import {Status, Role} from '../consts'


export default function Players({name, game, handleChoosePlayer}) {
  const choosing = game.currentPres.name === name &&
  (game.status === Status.CHOOSE_CHAN ||
   game.status === Status.INV ||
   game.status === Status.SE ||
   game.status === Status.GUN)

  const thisPlayer = game.players.find(player => player.name === name)

  const renderPlayers = game?.players?.map(player => {
    let cls = ""

    const voted = player.vote ? 'voted' : 'waiting on vote'

    if(choosing && player.name !== name && player.alive){
      cls += " choosable-player"
    }
    if(!player.alive){
      cls += " dead"
    }
    if(!player.socketId){
      cls += " disconnected"
    }
    if(game.prevPres?.name === player.name){
      cls += "prev-pres"
    }
    if(game.prevChan?.name === player.name){
      cls += " prev-chan"
    }
    if(game.currentChan?.name === player.name){
      cls += " current-chan"
    }
    if(game.currentPres?.name === player.name){
      cls += " current-pres"
    }
    //show your own role and anyone you've investigated
    if(player.name === name || thisPlayer.investigations.includes(player)){
      cls += `${player.role}`
    }
    if(thisPlayer.role === Role.FASC && (game.players.length < 7 || !thisPlayer.hitler) && player.role === Role.FASC){
      cls += ' Fascist'
    }

    return <li key={player.name}>
      <div className={cls} onClick={handleChoosePlayer}>{player.name}</div>
      {game.status === Status.VOTE && <label>{voted}</label>}
      {game.status === Status.VOTE_RESULT && <label>{player.vote}</label>}
      {(game.status === Status.END_FASC || game.status === Status.END_LIB) &&  (player.hitler ? 'Hitler' : player.role)}
      </li>
  })

  return (
    <div>
      <label>Players:</label>
      <ol>
        {renderPlayers}
      </ol>
    </div>
  )
}
