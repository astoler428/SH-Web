import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';
import DrawPile from '../img/DrawPile.png'
import DiscardPile from '../img/DiscardPile.png'
import {colors, policyPileAnimation} from '../consts'

export default function PolicyPiles({game, boardDimensions}) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const drawPileLength = game.deck.drawPile.length
  const discardPileLength = game.deck.discardPile.length
  const [policyPilesState, setPolicyPilesState] = useState({drawPile: drawPileLength, discardPile: discardPileLength})
  const [newPolicyPilesState, setNewPolicyPilesState] = useState({drawPile: drawPileLength, discardPile: discardPileLength})

  const initialDelay = .2
  const delayBetweenPolicies = .2
  const additionalDelayAffectingLabelValue = 800

  useEffect(() => {
    if(game.topDecked && drawPileLength > policyPilesState.drawPile){ //means reshuffled
      setNewPolicyPilesState({drawPile: policyPilesState.drawPile - 1, discardPile: policyPilesState.discardPile})
      setTimeout(() => setPolicyPilesState({...newPolicyPilesState}, initialDelay*1000 + additionalDelayAffectingLabelValue))
      setTimeout(() => setNewPolicyPilesState({drawPile: drawPileLength, discardPile: discardPileLength}), 6800 + initialDelay*1000)
      setTimeout(() => setPolicyPilesState({drawPile: drawPileLength, discardPile: discardPileLength}), 7000 + initialDelay*1000) //needs to be after above so asc desc is set correct
      return
    }
    if(policyPilesState.drawPile !== drawPileLength){
      setNewPolicyPilesState({drawPile: drawPileLength, discardPile: discardPileLength})
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, drawPile: drawPileLength})), drawPileLength === 0 ? initialDelay*1000 : initialDelay*1000 + additionalDelayAffectingLabelValue ) //only initial delay if empty to remove the count immediately, otherwise, 700ms after delay since 1s animation appears quicker with cubic bezzier
    }
    if(policyPilesState.discard !== discardPileLength){
      setNewPolicyPilesState({drawPile: drawPileLength, discardPile: discardPileLength})
      setTimeout(() => setPolicyPilesState(prevState => ({...prevState, discardPile: discardPileLength})), discardPileLength === 0 ? initialDelay*1000 : initialDelay*1000 + additionalDelayAffectingLabelValue)
    }
  }, [game.deck.drawPile.length, game.deck.discardPile.length]) //game.status

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

  for(let i = 0; i < 17; i++){
    let top = 0
    if(i >= newPolicyPilesState.drawPile){
      top = policyPilesWidth*1.6
    }
    const delay = policyPilesState.drawPile - newPolicyPilesState.drawPile > 0 ? descDelay(i, policyPilesState.drawPile) : ascDelay(i, policyPilesState.drawPile)
    const transition = `top 1s ${delay}s cubic-bezier(0.36, 0.7, 0.51, 0.94)`
    drawPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', transition}}/>)
  }


  for(let i = 0; i < 17; i++){
    let top = 0
    if(i >= newPolicyPilesState.discardPile){
      top = policyPilesWidth*1.6
    }
    const delay = policyPilesState.discardPile - newPolicyPilesState.discardPile > 0 ? descDelay(i, policyPilesState.discardPile) : ascDelay(i, policyPilesState.discardPile)
    const transition = `top 1s ${delay}s cubic-bezier(0.36, 0.7, 0.51, 0.94)`
    discardPilePolicies.push(<img src={PolicyBack} key={i} draggable='false' style={{position: 'absolute', top, left: 0, width: '100%', transition}}/>)
  }

  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <Box sx={{position: 'absolute', left: boardDimensions.x/22.5, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
        <img src={DrawPile} draggable='false' style={{ width: '100%' }}/>
        <style>{policyPileKeyFrames}</style>
        <Box sx={{position: 'absolute', overflow: 'hidden', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
        <img className="find-me" src={PolicyBack} draggable='false' style={{width: '100%', visibility: 'hidden'}}/>
          {drawPilePolicies}
          <Box sx={{...countStyles, visibility: policyPilesState.drawPile === 0 ? 'hidden' : 'visible'}}>
            {policyPilesState.drawPile}
          </Box>

      </Box>
        </Box>
      <Box sx={{position: 'absolute', right: boardDimensions.x/22.2, bottom: boardDimensions.x/9.8, width: policyPilesWidth*1.25}}>
        <img src={DiscardPile} draggable='false' style={{ width: '100%' }}/>
        <style>{policyPileKeyFrames}</style>
        <Box sx={{position: 'absolute', overflow: 'hidden', left: boardDimensions.x/95, bottom: boardDimensions.x/38, width: policyPilesWidth}}>
          <img src={PolicyBack} draggable='false' style={{width: '100%', visibility: 'hidden'}}/>
          {discardPilePolicies}
          <Box sx={{...countStyles, visibility: policyPilesState.discardPile === 0 ? 'hidden' : 'visible'}}>
            {policyPilesState.discardPile}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
