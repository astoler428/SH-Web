import React from 'react'
import {Status, Role, Team, GameType} from '../consts'


export default function Players({name, game, handleChoosePlayer}) {
  const choosing = game.currentPres === name &&
  (game.status === Status.CHOOSE_CHAN ||
   game.status === Status.INV ||
   game.status === Status.SE ||
   game.status === Status.GUN)

  const thisPlayer = game.players.find(player => player.name === name)

  const renderPlayers = game?.players?.map(player => {
    let cls = " "

    const voted = player.vote ? 'voted' : 'waiting on vote'

    if(choosing && player.name !== name && player.alive){
      let choosable = false
      if(game.status === Status.CHOOSE_CHAN){
        if(game.prevChan !== player.name && game.prevPres !== player.name){
          choosable = true
        }
      }
      else if(game.status === Status.INV){
        if(!player.investigated){
          choosable = true
        }
      }
      else{
        choosable = true
      }
      if(choosable){
        cls += " choosable-player "
      }

    }
    if(!player.alive){
      cls += " dead "
    }
    if(!player.socketId){
      cls += " disconnected "
    }
    if(game.prevPres === player.name){
      cls += "prev-pres "
    }
    if(game.prevChan === player.name){
      cls += " prev-chan "
    }
    if(game.currentChan === player.name){
      cls += " current-chan "
    }
    if(game.currentPres === player.name){
      cls += " current-pres "
    }
    //show your own role
    if(player.name === name && showOwnRole(player)){
      cls += ` ${player.role === Role.HITLER ? player.role : player.team} `
    }
    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(invName => invName === player.name)
    if(thisPlayerInvestigatedPlayer){
      cls += ` ${player.team} `
    }
    //fasc see other fasc
    if(player.name !== name && player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
      cls += ` ${player.role === Role.HITLER ? player.role : player.team} `
      if(player.confirmedFasc){
        cls += ` confirmed `
      }
    }

    return <li key={player.name}>
      <div className={cls} onClick={handleChoosePlayer}>{player.name}</div>
      {game.status === Status.VOTE && <label>{voted}</label>}
      {game.status === Status.VOTE_RESULT && <label>{player.vote}</label>}
      {(game.status === Status.END_FASC || game.status === Status.END_LIB) &&  (player.role)}
      </li>
  })

  function showOwnRole(player){
    return game.settings.type !== GameType.BLIND || player.confirmedFasc
  }

  function showOtherFasc(fascPlayer, otherFasc){
    if(game.settings.type !== GameType.BLIND){
      return fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc
    }
    if(!fascPlayer.confirmedFasc){
      return false
    }
    if(fascPlayer.omniFasc){
      return true
    }
    if((fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc) && (otherFasc.confirmedFasc || otherFasc.role === Role.HITLER)){
      return true
    }
  }

  return (
    <div>
      <label>Players:</label>
      <ol>
        {renderPlayers}
      </ol>
    </div>
  )
}
