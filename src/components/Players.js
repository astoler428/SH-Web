import React from 'react'

export default function Players({game}) {
  const players = game?.players?.map(player => {
    let cls = ""
    if(game.prevPres?.name === player.name){
      cls = "prev-pres"
    }
    if(game.prevChan?.name === player.name){
      cls = "prev-chan"
    }
    if(game.currentChan?.name === player.name){
      cls = "current-chan"
    }
    if(game.currentPres?.name === player.name){
      cls = "current-pres"
    }

    return <li className={cls} key={Math.random()}>{player.name}</li>
  })

  return (
    <div>
      <label>Players:</label>
      <ol>
        {players}
      </ol>
    </div>
  )
}
