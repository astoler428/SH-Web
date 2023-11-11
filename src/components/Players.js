import React, {useState, useRef, useEffect} from 'react'
import {Status, Role, Team, GameType, Vote, choosableAnimation, upAndDownAnimation, flipAndDownAnimation, upAnimation, flipAnimation, flipAndUnflipAnimation, stillAnimation} from '../consts'
import {Card, CircularProgress, Grid, Typography, Box} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

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
import partyBack from '../img/ParyBack.png'
//card height to width ratio = 1.36

const hitlerColor = 'darkred'
const fascColor = 'orangered'
const libColor = 'deepskyblue'
const hiddenColor = 'black'

export default function Players({name, game, handleChoosePlayer, boardDimensions}) {
  // game.status = Status.END_FASC
  // game.status = Status.STARTED
  const [playersDimensions, setPlayersDimensions] = useState({x: 0, y: 0})
  const imageRefs = useRef([])
  const playersRef = useRef(null)
  const thisPlayer = game.players.find(player => player.name === name)
  const n = game.players.length
  const status = game.status
  const cardBorderRadius  = playersDimensions.y / 32
  const gameOver = status === Status.END_FASC || status === Status.END_LIB

  const choosing = (game.currentPres === name &&
  (status === Status.CHOOSE_CHAN ||
   status === Status.INV ||
   status === Status.SE ||
   status === Status.GUN))
   || (thisPlayer.role === Role.HITLER && status === Status.LIB_SPY_GUESS)

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

    let showDueToInv = false
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
      showDueToInv = true
    }

    //animations

    if(status === Status.STARTED){
      if(player.name === name){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flip 6s forwards 2s'
      }
      else if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flipAndUnflip 6s forwards 4s'
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
    else if(status === Status.SHOW_INV_CHOICE && player.name === currentPres.investigations.slice(-1)[0]){
      if(currentPres.name === name){
        nameColor = showDueToInv ? hiddenColor : nameColor
        overlayContent = getTeamImg(player)[0]
      }
      else{
        overlayContent = partyBack
      }
      animation = 'upAndDown 3s forwards'
    }
    else if(status === Status.LIB_SPY_GUESS && player.role === Role.HITLER){
      nameColor = hitlerColor
      roleContent = roleBackPng
      roleContentFlip = hitlerPng
      roleAnimation = 'flip 2s forwards'
    }
    else if(status === Status.SHOW_LIB_SPY_GUESS){
      const spyGuessedPlayer = game.players.find(player => player.guessedToBeLibSpy)
      if(spyGuessedPlayer.name === player.name){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flip 2s forwards'
        }
    }
    else if(gameOver){
      [,nameColor] = getRoleImg(player)

      //flip over everyone elses role, unless blind in which case your needs flipping too if not confirmed
      if(player.name !== name || (game.settings.type === GameType.BLIND && !player.confirmedFasc)){
        roleContent = roleBackPng
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'flip 6s forwards 2.5s'
      }
      else{
        roleContent = getRoleImg(player)[0]
        roleContentFlip = getRoleImg(player)[0]
        roleAnimation = 'still .1s forwards'
      }
    }

    const flipAndDownkeyFrameStyles = flipAndDownAnimation(playersDimensions.y)
    const upKeyFrameStyles = upAnimation(playersDimensions.y)
    const flipKeyFrameStyles = flipAnimation()
    const upAndDownKeyFrameStyles = upAndDownAnimation(playersDimensions.y)
    const flipAndUnflipKeyFrameStyles = flipAndUnflipAnimation()
    const stillKeyFrameStyles = stillAnimation()
    const choosableKeyFrameStyles = choosableAnimation(playersDimensions.y < 110 ? 2 : 4)

    return (
    <Grid key={idx} item xs={12/n} sx={{}}>
      <Box sx={{opacity: player.socketId? 1 : .3, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Typography maxWidth='80%' sx={{fontSize: `calc(${playersDimensions.x}px / ${8*n})`, color: nameColor, whiteSpace: 'nowrap', fontFamily: 'inter', fontWeight: 400, overflow: 'hidden'}}>{idx+1}. {player.name}</Typography>
        <Card data-key={player.name} onClick={choosing && choosable ? handleChoosePlayer : ()=>{}} sx={{cursor: choosable ? 'pointer' : 'auto', boxShadow: choosable ? '0 0 0 3px orange' : 'none', animation: chooseAnimation, display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: 'rgb(46, 109, 28)'}}>
          <style>{flipAndDownkeyFrameStyles}</style>
          <style>{upKeyFrameStyles}</style>
          <style>{flipKeyFrameStyles}</style>
          <style>{upAndDownKeyFrameStyles}</style>
          <style>{flipAndUnflipKeyFrameStyles}</style>
          <style>{stillKeyFrameStyles}</style>
          <style>{choosableKeyFrameStyles}</style>
          {/* first rolebackimg is just a place holder */}
            <img src={roleBackPng}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, visibility: 'hidden'}}/>
          <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', perspective: 1000, bottom: 0, transformStyle: 'preserve-3d', animation: roleAnimation}}>
            <img ref={el => imageRefs.current[idx] = el} src={roleContent}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', backfaceVisibility: 'hidden'}}/>
            <img src={roleContentFlip}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}/>
          </div>
          <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', perspective: 1000, bottom: -playersDimensions.y, transformStyle: 'preserve-3d', animation}}>
            <img src={overlayContent}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', backfaceVisibility: 'hidden'}}/>
            <img src={overlayContentFlip}  style={{maxWidth: "100%", borderRadius: cardBorderRadius, position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',  }}/>
          </div>
          {!gameOver &&
            <>
          {game.currentPres === player.name && <img src={presPng} style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.currentChan === player.name && <img src={chanPng} style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.prevPres === player.name && <img src={presPng} style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
          {game.prevChan === player.name && <img src={chanPng} style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
          {makingDecision &&
          <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress thickness={2.5} style={{color: 'white', width: `calc(${playersDimensions.x}px / ${2.5*n} )`, height: `calc(${playersDimensions.x}px / ${2.5*n} )`}} />
          </Box>}
          {!player.alive && <CloseIcon sx={{width: '100%', height: '100%', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: 'red' }}/>}
            </>
          }
        </Card>
      </Box>
    </Grid> )
  })


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

  // determine dimensions of player area
  useEffect(() => {
    function handlePlayersResize(){
      if(playersRef.current && imageRefs.current.every(img => img.complete)){
        setPlayersDimensions({x: playersRef.current.offsetWidth, y: playersRef.current.offsetHeight})
      }
      else{
        setTimeout(handlePlayersResize, 100)
      }
    }
    handlePlayersResize()

    window.addEventListener('resize', handlePlayersResize);
    return () => {
      window.removeEventListener('resize', handlePlayersResize)
    }
  }, [])

  return (
    //not factoring in the height of the name label so can't use the 1.36, minWidth: 400?
    <Box ref={playersRef} sx={{width: {xs: `calc(20vh / 2.2 * ${n})`, sm: `calc((100vh - (56px + ${boardDimensions.y}px)) / 1.8 * ${n} )`}, minWidth: {sm: 600, md: 650}, maxWidth: `calc(140px * ${n})`}}>
        <Grid container spacing={{xs: .5, sm: 1}}>
          {renderPlayers}
        </Grid>
    </Box>

  )
}