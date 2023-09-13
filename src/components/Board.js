import React from 'react'

export default function Board({game}) {
  return (
    <div>
      <div>Lib policies played: {game.LibPoliciesEnacted}</div>
      <div>Fasc policies played: {game.FascPoliciesEnacted}</div>
      <div>Tracker: {game.tracker}</div>
      <div>DrawPile: {game.deck.drawPile.length}</div>
      <div>DiscardPile: {game.deck.discardPile.length}</div>
    </div>
  )
}

