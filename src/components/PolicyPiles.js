import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';
import DrawPile from '../img/DrawPile.png'
import DiscardPile from '../img/DiscardPile.png'
import {colors, policyPileDownAnimation, policyPileUpAnimation} from '../consts'

export default function PolicyPiles({game, boardDimensions}) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const drawPileLength = game.deck.drawPile.length
  const discardPileLength = game.deck.discardPile.length
  const [policyPilesState, setPolicyPilesState] = useState({drawPile: drawPileLength, discardPile: discardPileLength})
  const [policyPileCountDisplay, setPolicyPileCountDisplay] = useState({drawPile: drawPileLength, discardPile: discardPileLength})
  const [readyToReshuffle, setReadyToReshuffle] = useState(false) //used for when topdecking - first animate to policy

  const initialDelay = .3
  const delayBetweenPolicies = .2
  let drawPileAnimationTotalLength = 0
  let discardPileAnimationTotalLength = 0

  useEffect(() => {
    if(game.topDecked && drawPileLength > policyPilesState.drawPile){ //means reshuffled
      setTimeout(() => setPolicyPileCountDisplay(prevState => ({...prevState, drawPile: prevState.drawPile - 1})), (initialDelay + 1) * 1000) //subtracting a little bc animation seems done earlier
      setTimeout(() => {
        setReadyToReshuffle(true)
        setTimeout(() => setPolicyPilesState({drawPile: drawPileLength, discardPile: discardPileLength}), drawPileAnimationTotalLength*1000)
        setTimeout(() => setPolicyPileCountDisplay(prevState => ({...prevState, drawPile: drawPileLength})), drawPileAnimationTotalLength*1000)
        setTimeout(() => setPolicyPileCountDisplay(prevState => ({...prevState, discardPile: 0})), (initialDelay * 1000))
      }, 2500)
      return
    }
    setReadyToReshuffle(false)
    if(policyPilesState.drawPile !== drawPileLength){
      setTimeout(() => setPolicyPileCountDisplay(prevState => ({...prevState, drawPile: drawPileLength})), drawPileLength === 0 ? initialDelay * 1000 : drawPileAnimationTotalLength*1000) //subtracting a little bc animation seems done earlier
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, drawPile: drawPileLength})), 8000)//drawPileAnimationTotalLength*1000)
    }
    if(policyPilesState.discardPile !== discardPileLength){

      setTimeout(() => setPolicyPileCountDisplay(prevState => ({...prevState, discardPile: discardPileLength})), discardPileLength === 0 ? initialDelay * 1000 : discardPileAnimationTotalLength*1000)
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, discardPile: discardPileLength})), discardPileAnimationTotalLength*1000)
    }
  }, [game.deck.drawPile.length, game.deck.discardPile.length]) //game.status


  const policyPilesWidth = boardDimensions.x/12
  const policyPileDownKeyFrames = policyPileDownAnimation(policyPilesWidth*1.45)
  const policyPileUpKeyFrames = policyPileUpAnimation(policyPilesWidth*1.45)
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

  const drawPilePolicies = []
  const discardPilePolicies = []

  /**
   * waits for boardDimensions to load before setting the policy top values below
   * otherwise the top get set to 1.6*0 = 0 initially, which causes it to transition all the discards on first load
   */
  if(boardDimensions.x === 0){
    return
  }

  //new: cubic-bezier(0.36, 0.7, 0.51, 0.94)
  //old: cubic-bezier(0.13, 0.44, 0.49, 1.05)

  const descDelay = (idx, val) => initialDelay + (val-1 - idx)*delayBetweenPolicies
  const ascDelay = (idx, val) => initialDelay + (idx - val)*delayBetweenPolicies

  if(policyPilesState.drawPile > drawPileLength){
    //drawing policies
    for(let i = 0; i < policyPilesState.drawPile; i++){
      const top = 0
      const animation = i >= drawPileLength ? `1s policyPileDown ${descDelay(i, policyPilesState.drawPile)}s forwards` : ''
      drawPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', animation }}/>)
    }
    drawPileAnimationTotalLength = initialDelay + 1 + delayBetweenPolicies*(policyPilesState.drawPile - drawPileLength - 1)
  }
  else if(policyPilesState.drawPile < drawPileLength){
    //reshuffling
    if(game.topDecked && !readyToReshuffle){
      for(let i = 0; i < policyPilesState.drawPile; i++){
        const top = 0
        const animation = i === policyPilesState.drawPile - 1 ? `1s policyPileDown .2s forwards` : ''
        drawPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', animation }}/>)
      }
      drawPileAnimationTotalLength = initialDelay + 1 + delayBetweenPolicies*(drawPileLength - policyPilesState.drawPile - 1)
    }
    else{
      for(let i = 0; i < drawPileLength; i++){
        const top = i >= policyPilesState.drawPile ? policyPilesWidth * 1.45 : 0
        const animation = i >= policyPilesState.drawPile ? `1s policyPileUp ${ascDelay(i, policyPilesState.drawPile)}s forwards` : ''
        drawPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', animation }}/>)
      }
      drawPileAnimationTotalLength = initialDelay + 1 + delayBetweenPolicies*(drawPileLength - policyPilesState.drawPile - 1)
    }
  }
  else{
    for(let i = 0; i < drawPileLength; i++){
      drawPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top: 0, left: 0, width: '100%' }}/>)
    }
  }

  if(policyPilesState.discardPile < discardPileLength){
    //discarding policies
    for(let i = 0; i < discardPileLength; i++){
      const top = i >= policyPilesState.discardPile ? policyPilesWidth * 1.45 : 0
      const animation = i >= policyPilesState.discardPile ? `1s policyPileUp ${ascDelay(i, policyPilesState.discardPile)}s forwards` : ''
      discardPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', animation }}/>)
    }
    discardPileAnimationTotalLength = initialDelay + 1 + delayBetweenPolicies*(discardPileLength - policyPilesState.discardPile - 1)
  }
  else if(policyPilesState.discardPile > discardPileLength){
    //reshuffling
    if(game.topDecked && !readyToReshuffle){
      for(let i = 0; i < policyPilesState.discardPile; i++){
        discardPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top: 0, left: 0, width: '100%'}}/>)
      }
    }
    else{
      const numCardsInDiscardPile = drawPileLength - policyPilesState.drawPile // using this because on reshuffle, the final cards to discard never make it there - it could be 0 extra on a topdeck, 1 extra on a chan discard for play or 2 extra on a veto accepted
      for(let i = 0; i < numCardsInDiscardPile; i++){
        const top = 0
        const animation = `1s policyPileDown ${descDelay(i, numCardsInDiscardPile)}s forwards`
        discardPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', animation }}/>)
      }
      discardPileAnimationTotalLength = initialDelay + 1 + delayBetweenPolicies*(policyPilesState.discardPile - discardPileLength) //dont subtract 1 since the last dicarded card never gets counted, so it needs to be counted
    }
  }
  else{
    for(let i = 0; i < discardPileLength; i++){
      discardPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top: 0, left: 0, width: '100%' }}/>)
    }
  }

  return (
    <Box sx={{display: 'flex', gap: 1}}>
        <style>{policyPileDownKeyFrames}</style>
        <style>{policyPileUpKeyFrames}</style>
      <Box sx={{position: 'absolute', left: boardDimensions.x/22.5, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
        <img src={DrawPile} draggable='false' style={{ width: '100%' }}/>
        <Box sx={{position: 'absolute', overflow: 'hidden', left: boardDimensions.x/95, bottom: boardDimensions.x/30, width: policyPilesWidth, display: 'flex'}}>
        <img className="find-me" src={PolicyBack} draggable='false' style={{width: '100%', visibility: 'hidden'}}/>
          {drawPilePolicies}
          <Box sx={{...countStyles, visibility: policyPileCountDisplay.drawPile === 0 ? 'hidden' : 'visible'}}>
            {policyPileCountDisplay.drawPile}
          </Box>

      </Box>
        </Box>
      <Box sx={{position: 'absolute', right: boardDimensions.x/22.2, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
        <img src={DiscardPile} draggable='false' style={{ width: '100%' }}/>
        <Box sx={{position: 'absolute', overflow: 'hidden', left: boardDimensions.x/95, bottom: boardDimensions.x/30, width: policyPilesWidth, display: 'flex'}}>
          <img src={PolicyBack} draggable='false' style={{width: '100%', visibility: 'hidden'}}/>
          {discardPilePolicies}
          <Box sx={{...countStyles, visibility: policyPileCountDisplay.discardPile === 0 ? 'hidden' : 'visible'}}>
            {policyPileCountDisplay.discardPile}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
