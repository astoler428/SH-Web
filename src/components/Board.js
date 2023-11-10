import React, {useState, useRef, useEffect} from 'react'
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
import { enactPolicyAnimation, Policy } from '../consts'


//set policy border radius relative to the policyWidth here and everywhere
export default function Board({game, name, id, setError, showInvCard, boardRef, imageRefs, boardDimensions}){
  const fascBoard = game.players.length < 7 ? fasc5PlayerBoard : game.players.length < 9 ? fasc7PlayerBoard : fasc9PlayerBoard
  const [blur, setBlur] = useState(false)
  const [animate, setAnimate] = useState(null)
  const policyWidth = boardDimensions.x / 8.2
  const [boardState, setBoardState] = useState({lib: game.LibPoliciesEnacted, fasc: game.FascPoliciesEnacted, tracker: game.tracker})
  const fascBottom = boardDimensions.x / 2.12
  const fascLeft = boardDimensions.x / 10
  const libBottom = boardDimensions.x / 10
  const libLeft = boardDimensions.x / 5.9
  // const policyGap = boardDimensions.x/610
  const policyGap = boardDimensions.x/75
  const trackerWidth = boardDimensions.x / 28.1
  const trackerGap = '9.3%'
  const trackerLeft = '33.9%'
  const trackerBottom = '7%'

  //tracker moves, policy enacted, then tracker moves back

  let policyAnimation = '', enactPolicyImg, enactPolicyKeyFrames, policyDelay = 0

  useEffect(() => {
    if(boardState.lib < game.LibPoliciesEnacted){
      setAnimate(Policy.LIB)
      setTimeout(() => {
        setAnimate(null)
        setBoardState(prevBoardState => ({...prevBoardState, lib: game.LibPoliciesEnacted}))
      }, 5800)
    }
    if(boardState.fasc < game.FascPoliciesEnacted){
      setAnimate(Policy.FASC)
      setTimeout(() => {
        setAnimate(null)
        setBoardState(prevBoardState => ({...prevBoardState, fasc: game.FascPoliciesEnacted}))
      }, 6000)
    }
    if(boardState.tracker === 2 && game.tracker === 0 && !game.prevChan){
      setBoardState(prevBoardState => ({...prevBoardState, tracker: 3}))
      policyDelay = 1
      setTimeout(() => {
        setBoardState(prevBoardState => ({...prevBoardState, tracker: game.tracker}))
      }, 6800)
    }
    else if(boardState.tracker !== 3 && boardState.tracker !== game.tracker){
      setBoardState(prevBoardState => ({...prevBoardState, tracker: game.tracker}))
    }
  }, [game])

    if(boardState.tracker === 3){
      policyDelay = 1
    }

    if(animate === Policy.LIB){
      enactPolicyImg = libPolicyPng
      enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, libLeft, libBottom, policyGap, game.LibPoliciesEnacted)
      policyAnimation = `enact 6s ${policyDelay}s`
    }
    else if(animate === Policy.FASC){
      enactPolicyImg = fascPolicyPng
      enactPolicyKeyFrames = enactPolicyAnimation(policyWidth, fascLeft, fascBottom, policyGap, game.FascPoliciesEnacted)
      policyAnimation = `enact 6s ${policyDelay}s`
    }


  const fascCount = boardState.fasc //animate === Policy.FASC ? game.FascPoliciesEnacted-1 : game.FascPoliciesEnacted
  const libCount = boardState.lib //animate === Policy.LIB ? game.LibPoliciesEnacted-1 : game.LibPoliciesEnacted

  const fascPolicies = []
  for(let i = 0; i < fascCount; i++){
    fascPolicies.push(<img key={i} src={fascPolicyPng} style={{ width: policyWidth, borderRadius: boardDimensions.x/150  }}/>)
  }
  const libPolicies = []
  for(let i = 0; i < libCount; i++){
    libPolicies.push(<img key={i} src={libPolicyPng} style={{ width: policyWidth, borderRadius: boardDimensions.x/150 }}/>)
  }

  return (
    <>
      <Box sx={{width: {xs: '100vw', sm: '50vw'}, maxWidth: {sm: 700}, display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <Action game={game} name={name} id={id} setError={setError} blur={blur} setBlur={setBlur} showInvCard={showInvCard} boardDimensions={boardDimensions}/>
        <Box ref={boardRef} sx={{filter: blur ? 'blur(5px)' : 'blur(0)', zIndex: -1, display: 'flex', flexDirection: 'column'}}>
          <img ref={el => imageRefs.current[0] = el} key={1} src={fascBoard} draggable='false' style={{ maxWidth: "100%"}}/>
          <img ref={el => imageRefs.current[1] = el} key={2} src={libBoard} draggable='false' style={{ maxWidth: "100%" }}/>
          <Box sx={{position: 'absolute', bottom: fascBottom, left: fascLeft, display: 'flex', gap: `${policyGap}px`}}>
            {fascPolicies}
          </Box>
          <Box sx={{position: 'absolute', bottom: libBottom, left: libLeft, display: 'flex', gap: `${policyGap}px`}}>
            {libPolicies}
          </Box>
          <style>{enactPolicyKeyFrames}</style>
          <div style={{position: 'absolute', width: policyWidth*1.4, backgroundColor: 'transparent', display: 'flex', perspective: 1000, borderRadius: boardDimensions.x/200, left: -1.4*policyWidth, bottom: 0, transformStyle: 'preserve-3d', animation: policyAnimation}}>
{/*First is just a placeholder img to set the size since the absolute images below don't affect size of Box - since lib and fasc images are slightly different sizes its causing a flicker?*/}
            <img src={libPolicyPng} style={{width: '100%', visibility: 'hidden', borderRadius: boardDimensions.x/200}}/>
            <img src={policyBackPng} style={{width: '100%', position: 'absolute', backfaceVisibility: 'hidden', borderRadius: boardDimensions.x/200}}/>
            <img src={enactPolicyImg} style={{width: '100%', position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', borderRadius: boardDimensions.x/200}}/>
          </div>
            <div style={{backgroundColor: 'blue', width: trackerWidth, height: trackerWidth, borderRadius: '100%', position: 'absolute', bottom: trackerBottom, left: `calc(${trackerLeft} + ${boardState.tracker} * ${trackerGap})`, transition: '1s' }}></div>
            <PolicyPiles game={game} boardDimensions={boardDimensions}/>
        </Box>
      </Box>


    </>
  )
  }


