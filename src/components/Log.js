import React from 'react'

export default function Log({game}) {
  return (
    <div>
      {game.log.map((entry, i) => <div key={i}>{entry}</div>)}
    </div>
  )
}
