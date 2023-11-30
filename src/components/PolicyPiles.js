import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';
import DrawPile from '../img/DrawPile.png'
import DiscardPile from '../img/DiscardPile.png'
import {colors, policyPileAnimation} from '../consts'

export default function PolicyPiles({game, boardDimensions}) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const [policyPilesState, setPolicyPilesState] = useState({drawPile: game.deck.drawPile.length, discardPile: game.deck.discardPile.length})
  const [drawPileAnimation, setDrawPileAnimation] = useState('')
  const [discardPileAnimation, setDiscardPileAnimation] = useState('')
  const animationTime = .3
  useEffect(() => {
    if(policyPilesState.drawPile !== game.deck.drawPile.length){
      const n = policyPilesState.drawPile - game.deck.drawPile.length
      const iterations = Math.abs(n) > 3 ? 1 : Math.abs(n) //means putting discard pile back
      const setPolicyStateTimeout = n === 3 ? animationTime*2000 + 300 : animationTime*1000 + 300 //the 2 seconds is so if 3 cards left in deck, the deck shows blank as 3rd card is drawn
      setDrawPileAnimation(`policyPile ${animationTime}s ${iterations} ${n === 1 ? '1s' : '.3s'} ${n > 0 ? '' : 'forwards reverse'}`) //delay 1s if topdeck to wait for tracker
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, drawPile: game.deck.drawPile.length})), setPolicyStateTimeout)
      setTimeout(() => setDrawPileAnimation(''), animationTime*iterations*1000 + 300)
    }
    if(policyPilesState.discardPile !== game.deck.discardPile.length){
      const n = policyPilesState.discardPile - game.deck.discardPile.length
      const iterations = Math.abs(n) > 2 ? 1 : Math.abs(n) // > 2 means putting back in draw pile. 1 means discard, 2 from veto accepted
      const setPolicyStateTimeout = Math.abs(n) > 2 ? 0 + 300 : animationTime*1000 + 300
      setDiscardPileAnimation(`policyPile ${animationTime}s ${iterations} .3s ${n > 0 ? '' : 'forwards reverse'}`)
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, discardPile: game.deck.discardPile.length})), setPolicyStateTimeout)
      setTimeout(() => setDiscardPileAnimation(''), animationTime*iterations*1000 + 300)

    }
  }, [game.status])

  const policyPilesWidth = boardDimensions.x/12
  const policyPileKeyFrames = policyPileAnimation(policyPilesWidth)
  const countStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: colors.hidden,
    backgroundColor: '#302F2F',
    fontFamily: 'inter',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: boardDimensions.x/35,
    height: boardDimensions.x/35,
    fontWeight: 'bold',
    borderRadius: boardDimensions.x/1800,
    fontSize: boardDimensions.x/48
  }
 //22.5, 9.5
 //27 32
 //17.5 9.8, 95, 38 and 17.2 and then same

  return (
      <Box sx={{display: 'flex', gap: 1}}>
        <Box sx={{position: 'absolute', left: boardDimensions.x/22.5, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
          <img src={DrawPile} draggable='false' style={{ width: '100%' }}/>
          <style>{policyPileKeyFrames}</style>
          <Box sx={{position: 'absolute', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
            <img src={PolicyBack} draggable='false' style={{ width: '100%', visibility: policyPilesState.drawPile === 0 ? 'hidden' : 'visible'}}/>
            <img src={PolicyBack} draggable='false' style={{position: 'absolute', top: 0, left: 0, width: '100%', visibility: 'hidden', animation: drawPileAnimation}}/>
            <Box sx={{...countStyles, visibility: policyPilesState.drawPile === 0 ? 'hidden' : 'visible'}}>
              {policyPilesState.drawPile}
            </Box>

        </Box>
          </Box>
        <Box sx={{position: 'absolute', right: boardDimensions.x/22.2, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
          <img src={DiscardPile} draggable='false' style={{ width: '100%' }}/>
          <style>{policyPileKeyFrames}</style>
          <Box sx={{position: 'absolute', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
            <img src={PolicyBack} draggable='false' style={{width: '100%', visibility: policyPilesState.discardPile === 0 ? 'hidden' : 'visible' }}/>
            <img src={PolicyBack} draggable='false' style={{position: 'absolute', top: 0, left: 0, width: '100%', visibility: 'hidden', animation: discardPileAnimation}}/>
            <Box sx={{...countStyles, visibility: policyPilesState.discardPile === 0 ? 'hidden' : 'visible'}}>
              {policyPilesState.discardPile}
            </Box>
          </Box>
        </Box>
      </Box>
  )
}
