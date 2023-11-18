import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'
import fasc5PlayerBoard from '../img/fasc5PlayerBoard.png'
import fasc7PlayerBoard from '../img/fasc7PlayerBoard.png'
import fasc9PlayerBoard from '../img/fasc9PlayerBoard.png'
import libBoard from '../img/libBoard.png'
import libPolicyPng from '../img/LibPolicy.png'
import fascPolicyPng from '../img/FascPolicy.png'
import policyBackPng from '../img/PolicyBack.png';
import Action from './Action';
import PolicyPiles from './PolicyPiles';
import { enactPolicyAnimation, Policy, Status } from '../consts'


//set policy border radius relative to the policyWidth here and everywhere
export default function Board({game, name, id, setError, showInvCard, boardRef, boardImageRefs, boardDimensions, playersDimensions}){
  const fascBoard = game.players.length < 7 ? fasc5PlayerBoard : game.players.length < 9 ? fasc7PlayerBoard : fasc9PlayerBoard
  const [blur, setBlur] = useState(false)
  const [animate, setAnimate] = useState(null)
  const policyWidth = boardDimensions.x / 8.2
  const policyBorderRadius = policyWidth / 18
  const [boardState, setBoardState] = useState({lib: game.LibPoliciesEnacted, fasc: game.FascPoliciesEnacted, tracker: game.tracker})
  const fascBottom = boardDimensions.x / 2.12
  const fascLeft = boardDimensions.x / 10
  const libBottom = boardDimensions.x / 10
  const libLeft = boardDimensions.x / 5.9
  const policyGap = boardDimensions.x/75
  const trackerWidth = boardDimensions.x / 28.1
  const trackerGap = '9.3%'
  const trackerLeft = '33.9%'
  const trackerBottom = '7%'

  let policyAnimation = '', enactPolicyImg, enactPolicyKeyFrames, policyDelay = 0

  useEffect(() => {
    let timeout = 5800
    if(boardState.tracker === 2 && game.tracker === 0 && !game.prevChan){ //means top deck. If prevChan then it was just a gov on hammer
      timeout = 6800
      if(boardState.lib < game.LibPoliciesEnacted){
        setAnimate(Policy.LIB)
      }
      else{
        setAnimate(Policy.FASC)
      }
      setBoardState(prevBoardState => ({...prevBoardState, tracker: 3}))
      setTimeout(() => {
        setAnimate(null)
        setBoardState({lib: game.LibPoliciesEnacted, fasc: game.FascPoliciesEnacted, tracker: game.tracker})
      }, timeout)
      return
    }
    if(boardState.lib < game.LibPoliciesEnacted){
      setAnimate(Policy.LIB)
      setTimeout(() => {
        setAnimate(null)
        setBoardState(prevBoardState => ({...prevBoardState, lib: game.LibPoliciesEnacted}))
      }, timeout)
    }
    else if(boardState.fasc < game.FascPoliciesEnacted){
      setAnimate(Policy.FASC)
      setTimeout(() => {
        setAnimate(null)
        setBoardState(prevBoardState => ({...prevBoardState, fasc: game.FascPoliciesEnacted}))
      }, timeout)
    }

    if(boardState.tracker !== 3 && boardState.tracker !== game.tracker){ //advance tracker - if tracker is 3, that means I put it there and in middle of top deck
      setBoardState(prevBoardState => ({...prevBoardState, tracker: game.tracker}))
    }

  }, [game.status])

    if(boardState.tracker === 3){
      policyDelay = 1
    }

    if(animate === Policy.LIB){
      enactPolicyImg = libPolicyPng
      enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, policyBorderRadius, libLeft, libBottom, policyGap, game.LibPoliciesEnacted)
      policyAnimation = `enact 6s ${policyDelay}s`
    }
    else if(animate === Policy.FASC){
      enactPolicyImg = fascPolicyPng
      enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, policyBorderRadius, fascLeft, fascBottom, policyGap, game.FascPoliciesEnacted)
      policyAnimation = `enact 6s ${policyDelay}s`
    }

  const fascCount = boardState.fasc
  const libCount = boardState.lib

  const fascPolicies = []
  for(let i = 0; i < fascCount; i++){
    fascPolicies.push(<img key={i} src={fascPolicyPng} style={{ width: policyWidth, borderRadius: policyBorderRadius  }}/>)
  }
  const libPolicies = []
  for(let i = 0; i < libCount; i++){
    libPolicies.push(<img key={i} src={libPolicyPng} style={{ width: policyWidth, borderRadius: policyBorderRadius }}/>)
  }

  return (
    <>
      <Box sx={{width: {xs: '100vw', sm: '50vw'}, maxWidth: {sm: 700}, display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <Action game={game} name={name} id={id} setError={setError} blur={blur} setBlur={setBlur} showInvCard={showInvCard} boardDimensions={boardDimensions} playersDimensions={playersDimensions}/>
        <Box ref={boardRef} sx={{filter: blur ? 'contrast(40%) blur(2px)' : 'blur(0)', zIndex: -1, display: 'flex', flexDirection: 'column', transition: 'filter .8s'}}>
          <img ref={el => boardImageRefs.current[0] = el} key={1} src={fascBoard} style={{ maxWidth: "100%"}}/>
          <img ref={el => boardImageRefs.current[1] = el} key={2} src={libBoard} style={{ maxWidth: "100%" }}/>
          <Box sx={{position: 'absolute', bottom: fascBottom, left: fascLeft, display: 'flex', gap: `${policyGap}px`}}>
            {fascPolicies}
          </Box>
          <Box sx={{position: 'absolute', bottom: libBottom, left: libLeft, display: 'flex', gap: `${policyGap}px`}}>
            {libPolicies}
          </Box>
          <style>{enactPolicyKeyFrames}</style>
          <div style={{position: 'absolute', width: policyWidth*1.4, backgroundColor: 'transparent', display: 'flex', perspective: 1000, borderRadius: policyBorderRadius*1.4, left: -1.4*policyWidth, bottom: 0, transformStyle: 'preserve-3d', animation: policyAnimation}}>
{/*First is just a placeholder img to set the size since the absolute images below don't affect size of Box - since lib and fasc images are slightly different sizes its causing a flicker?*/}
            <img src={libPolicyPng} style={{width: '100%', visibility: 'hidden', borderRadius: policyBorderRadius*1.4}}/>
            <img src={policyBackPng} style={{width: '100%', position: 'absolute', backfaceVisibility: 'hidden', borderRadius: policyBorderRadius*1.4}}/>
            <img src={enactPolicyImg} style={{width: '100%', position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', borderRadius: policyBorderRadius*1.4}}/>
          </div>
            <div style={{backgroundColor: 'blue', width: trackerWidth, height: trackerWidth, borderRadius: '100%', position: 'absolute', bottom: trackerBottom, left: `calc(${trackerLeft} + ${boardState.tracker} * ${trackerGap})`, transition: '1s left ease-in-out' }}></div>
            <PolicyPiles game={game} boardDimensions={boardDimensions}/>
        </Box>
      </Box>
    </>
  )
  }

