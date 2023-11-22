import React, {useState, useRef, useEffect} from 'react'
import {Status, gameOver, Role, Team, GameType, Vote, choosableAnimation, upAndDownAnimation, flipAndDownAnimation, upAnimation, flipAnimation, flipAndUnflipAnimation, stillAnimation} from '../consts'
import {Card, CircularProgress, Grid, Typography, Box} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import liberalSpyPng from '../img/LiberalSpy.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libPartyPng from '../img/LibParty.png'
import fascPartyPng from '../img/FascParty.png'
import jaPng from '../img/Ja.png'
import neinPng from '../img/Nein.png'
import presPng from '../img/President.png'
import chanPng from '../img/Chancellor.png'
import voteBackPng from '../img/VoteBack.png'
import errorPng from '../img/Error.png'
import partyBack from '../img/PartyBack.png'
//card height to width ratio = 1.36

const hitlerColor = '#A72323'
const fascColor = 'orangered'
const libColor = 'deepskyblue'
const hiddenColor = '#f5f5f5'

export default function Players({name, game, handleChoosePlayer, playerImageRefs, playersRef, playersDimensions, boardDimensions}) {
  // game.status = Status.END_FASC
  // game.status = Status.STARTED
  const [firstRender, setFirstRender] = useState(true)
  const [pauseChoosing, setPauseChoosing] = useState(false)
  const thisPlayer = game.players.find(player => player.name === name)
  const n = game.players.length
  const status = game.status
  const cardBorderRadius  = playersDimensions.y / 32

  const choosing = !pauseChoosing && ((game.currentPres === name &&
  (status === Status.CHOOSE_CHAN ||
    status === Status.INV ||
   status === Status.SE ||
   status === Status.GUN))
   || (thisPlayer.role === Role.HITLER && status === Status.LIB_SPY_GUESS))

  const currentPres = game.players.find(player => player.name === game.currentPres)
  const getRoleImg = (player) => game.settings.type === GameType.MIXED_ROLES && player.role !== Role.HITLER ? [player.role === Role.FASC ? fascistPng : liberalPng, getTeamImg(player)[1]] : player.role === Role.HITLER ? [hitlerPng,hitlerColor] : player.role === Role.FASC ? [fascistPng,fascColor] : player.role === Role.LIB_SPY ? [liberalSpyPng, libColor] : [liberalPng,libColor]
  const getTeamImg = (player) => player.team === Team.FASC ? [fascPartyPng, fascColor] : [libPartyPng, libColor]
  const getVote = (player) => player.vote === Vote.JA ? jaPng : player.vote === Vote.NEIN ? neinPng : errorPng



  const renderPlayers = game?.players?.map((player, idx) => {
    let choosable = false
    let makingDecision = false
    let nameColor = hiddenColor
    let roleContent = roleBackPng
    let roleContentFlip = roleBackPng
    let overlayContent = null
    let overlayContentFlip = null
    let animation = ''
    let roleAnimation = ''
    let chooseAnimation = ''
    // let nameAnimation = ''
    let nameColorTransition = ''
    // let nameColorKeyFrames

    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(invName => invName === player.name)

    //check if player is choosable
    if(choosing && player.name !== name){
      if(status === Status.LIB_SPY_GUESS){
        choosable = player.team === Team.LIB || (!game.settings.hitlerKnowsFasc && player.role !== Role.HITLER)
      }
      else if(!player.alive){
        choosable = false
      }
      else if(status === Status.CHOOSE_CHAN){
        choosable = game.prevChan !== player.name && game.prevPres !== player.name
      }
      else if(status === Status.INV){
        choosable = !player.investigated
      }
      else{
        choosable = true
      }
    }

    if(choosable){
      chooseAnimation = 'choosable 1.3s infinite'
    }

    //making decision for circular progress bar

    if(game.currentPres === player.name){
      if(status === Status.CHOOSE_CHAN || status === Status.PRES_DISCARD || status === Status.PRES_CLAIM || status === Status.GUN || status === Status.INSPECT_TOP3 || status === Status.INV || status === Status.INV_CLAIM || status === Status.VETO_REPLY || status === Status.SE){
        makingDecision = true
      }
    }
    if(game.currentChan === player.name){
      if(status === Status.CHAN_PLAY || status === Status.CHAN_CLAIM || status === Status.VETO_DECLINED ){
        makingDecision = true
      }
    }
    if(status === Status.VOTE && !player.vote && player.alive){
      makingDecision = true
    }
    if(status === Status.LIB_SPY_GUESS && player.role === Role.HITLER){
      makingDecision = true
    }

    //content of role and name color

    //your own role
    if(player.name === name){
      [roleContent, nameColor] = showOwnRole(player) ? getRoleImg(player) : [roleBackPng, hiddenColor]
    }
    //fasc see other fasc
    else if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
      [, nameColor] = getRoleImg(player)
    }
    else if(thisPlayerInvestigatedPlayer){
      [, nameColor] = getTeamImg(player)
    }

    //animations


    if(status === Status.STARTED && game.settings.type !== GameType.BLIND){
      if(player.name === name){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flip 1s forwards 2s'
        nameColorTransition = 'color 1s 2s'
      }
      else if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flipAndUnflip 5s forwards 4s'
        nameColorTransition = 'color 1s 4s'
      }
    }
    else if(status === Status.VOTE){
      if(player.alive){
        overlayContent = voteBackPng
        animation = 'up 1s forwards'
      }
    }
    else if(status === Status.SHOW_VOTE_RESULT){
      if(player.alive){
        overlayContent = voteBackPng
        overlayContentFlip = getVote(player)
        animation = 'flipAndDown 3s forwards'
      }
    }
    else if(status === Status.INV_CLAIM && player.name === currentPres.investigations.slice(-1)[0]){
      if(currentPres.name === name){
        nameColor = getTeamImg(player)[1]
        nameColorTransition = 'color 1s 1s'
        overlayContent = getTeamImg(player)[0]
      }
      else{
        overlayContent = partyBack
      }
      animation = 'upAndDown 3s forwards'
    }
    else if(status === Status.LIB_SPY_GUESS && player.role === Role.HITLER && player.name !== name){
      nameColor = hitlerColor
      roleContent = roleBackPng
      roleContentFlip = hitlerPng
      roleAnimation = 'flipAndUnflip 3s forwards 4s'
      // nameColorTransition = 'color 1s 1s'
    }
    else if(status === Status.SHOW_LIB_SPY_GUESS){
      const spyGuessedPlayer = game.players.find(player => player.guessedToBeLibSpy)
      if(spyGuessedPlayer.name === player.name){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flipAndUnflip 3s forwards'
        // nameColorTransition = 'color 1s 1s'
      }
    }
    else if(gameOver(status)){
      [,nameColor] = getRoleImg(player)

      //flip over everyone elses role, unless blind in which case your needs flipping too if not confirmed
      if(player.name !== name || (game.settings.type === GameType.BLIND && !player.confirmedFasc)){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flip 3s forwards 2.5s'
        nameColorTransition = 'color 1.5s 4s'
      }
      else{
        //maybe don't need this??
        // roleContent = getRoleImg(player)[0]
        // roleContentFlip = getRoleImg(player)[0]
        // roleAnimation = 'still .1s forwards'
        // nameColorTransition = 'color .1s .1s'
      }
    }

    if(firstRender){
      nameColor = hiddenColor
      nameColorTransition = 'color .1s'
    }

    const flipAndDownkeyFrameStyles = flipAndDownAnimation(playersDimensions.y)
    const upKeyFrameStyles = upAnimation(playersDimensions.y)
    const flipKeyFrameStyles = flipAnimation()
    const upAndDownKeyFrameStyles = upAndDownAnimation(playersDimensions.y)
    const flipAndUnflipKeyFrameStyles = flipAndUnflipAnimation(status === Status.LIB_SPY_GUESS ? 33 : 20)
    const stillKeyFrameStyles = stillAnimation()
    const choosableKeyFrameStyles = choosableAnimation(playersDimensions.y < 110 ? 1.5 : 3.5)
    return (
      //I turned the Card into a Box where it's data-key to avoid the built int border / box
    <Grid key={idx} item xs={12/n} sx={{}}>
      <Box sx={{opacity: player.socketId? 1 : .3, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Typography maxWidth='80%' sx={{fontSize: {xs: `calc(${playersDimensions.x}px / ${7*n})` , sm: `calc(${playersDimensions.x}px / ${8*n})`}, margin: `1px 0`, color: nameColor, whiteSpace: 'nowrap', fontFamily: 'inter', fontWeight: 500, overflow: 'hidden', transition: nameColorTransition}}>{idx+1}. {player.name}</Typography>
        <Card data-key={player.name} onClick={choosing && choosable ? handleChoosePlayer : ()=>{}} sx={{cursor: choosable ? 'pointer' : 'auto', animation: chooseAnimation, display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#404040'}}>
          <style>{flipAndDownkeyFrameStyles}</style>
          <style>{upKeyFrameStyles}</style>
          <style>{flipKeyFrameStyles}</style>
          <style>{upAndDownKeyFrameStyles}</style>
          <style>{flipAndUnflipKeyFrameStyles}</style>
          <style>{stillKeyFrameStyles}</style>
          <style>{choosableKeyFrameStyles}</style>
          {/* first rolebackimg is just a place holder */}
            <img src={roleBackPng}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, visibility: 'hidden'}}/>
          <div style={{position: 'absolute', zIndex: 10, width: '100%', height: '100%', backgroundColor: 'transparent', perspective: 1000, bottom: 0, transformStyle: 'preserve-3d', animation: roleAnimation}}>
            <img ref={el => playerImageRefs.current[idx] = el} src={roleContent}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', backfaceVisibility: 'hidden'}}/>
            <img src={roleContentFlip}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}/>
          </div>
          <div style={{position: 'absolute', zIndex: 50, width: '100%', height: '100%', backgroundColor: 'transparent', perspective: 1000, bottom: -playersDimensions.y, transformStyle: 'preserve-3d', animation}}>
            <img src={overlayContent}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', backfaceVisibility: 'hidden'}}/>
            <img src={overlayContentFlip}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',  }}/>
          </div>
          {!gameOver(status) &&
            <>
          {game.currentPres === player.name && <img src={presPng} style={{maxWidth: "100%", position: 'absolute', zIndex: 15, bottom: 0}}/>}
          {game.currentChan === player.name && <img src={chanPng} style={{maxWidth: "100%", position: 'absolute', zIndex: 15, bottom: 0}}/>}
          {game.prevPres === player.name && <img src={presPng} style={{opacity: .2, maxWidth: "100%", position: 'absolute', zIndex: 15, top: 0}}/>}
          {game.prevChan === player.name && <img src={chanPng} style={{opacity: .2, maxWidth: "100%", position: 'absolute', zIndex: 15, top: 0}}/>}
          {makingDecision &&
          <Box sx={{ position: 'absolute', zIndex: 100, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress thickness={2.5} style={{color: '#f5f5f5', width: `calc(${playersDimensions.x}px / ${2.5*n} )`, height: `calc(${playersDimensions.x}px / ${2.5*n} )`}} />
          </Box>}
          {!player.alive && <CloseIcon sx={{width: '100%', height: '100%', position: 'absolute', zIndex: 100, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}/>}
          {player.name === name && !showOwnRole(player) && <QuestionMarkIcon sx={{width: '100%', height: '100%', position: 'absolute', zIndex: 20, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: 'black' }}/>}
            </>
          }
        </Card>
      </Box>
    </Grid> )
  })

  /**
   * zIndex order:
   * roleContent: 10
   * prev and current pres and chan: 15
   * Dead: 20
   * overlayContent: 50
   * CircularProgress: 100
   */

  useEffect(() => {
    setFirstRender(false)
  }, [])

  useEffect(() => {
    if(status === Status.LIB_SPY_GUESS){
      setPauseChoosing(true)
      setTimeout(() => setPauseChoosing(false), 7000) //4 seconds for policy to enact + 3 seconds for flip animation
    }
  }, [status])

  function showOwnRole(player){
    return game.settings.type !== GameType.BLIND || player.confirmedFasc
  }

  function showOtherFasc(fascPlayer, otherFasc){
    //in lib spy game, hitler doesnt know fasc
    if(game.settings.type !== GameType.BLIND){
      return fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc
    }
    if(!fascPlayer.confirmedFasc){
      return false
    }
    if(fascPlayer.omniFasc){
      return true
    }
    if(fascPlayer.role !== Role.HITLER || game.settings.hitlerKnowsFasc){
      //just return true if fasc see all other fasc
      return otherFasc.confirmedFasc || otherFasc.role === Role.HITLER
    }
    return false
  }

  //xs: `min(100vw, calc(70px * ${n}))`,
  return (
    <Box ref={playersRef} sx={{width: {xs: 'calc(100vw-10px)', sm: `calc((100vh - (56px + ${boardDimensions.y}px)) / 1.8 * ${n} )`}, minWidth: {sm: `calc(60px * ${n})`, md: `calc(90px * ${n})`}, maxWidth: {sm: `min(calc(100vw - 10px), calc(140px * ${n}))`}, display: 'flex', margin: '0 5px'}}>
        <Grid container spacing={{xs: .5, sm: 1}}>
          {renderPlayers}
        </Grid>
    </Box>
  )
}
