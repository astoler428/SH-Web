import React, {useState, useRef, useEffect} from 'react'
import {Status, Role, Team, GameType, Vote, upAndDownAnimation, flipAndDownAnimation, upAnimation, flipAnimation, flipAndUnflipAnimation, stillAnimation} from '../consts'
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

  const [playersDimensions, setPlayersDimensions] = useState({x: 0, y: 0})
  const imageRefs = useRef([])
  const playersRef = useRef(null)
  const thisPlayer = game.players.find(player => player.name === name)
  const n = game.players.length
  const gameOver = game.status === Status.END_FASC || game.status === Status.END_LIB

  const choosing = (game.currentPres === name &&
  (game.status === Status.CHOOSE_CHAN ||
   game.status === Status.INV ||
   game.status === Status.SE ||
   game.status === Status.GUN))
   || (thisPlayer.role === Role.HITLER && game.status === Status.LIB_SPY_GUESS)

  const currentPres = game.players.find(player => player.name === game.currentPres)
  const getRoleImg = (player) => game.settings.type === GameType.MIXED_ROLES && player.team === Team.FASC && player.role !== Role.HITLER ? [fascistPng, getTeamImg(player)[1]] : player.role === Role.HITLER ? [hitlerPng,hitlerColor] : player.role === Role.FASC ? [fascistPng,fascColor] : player.role === Role.LIB_SPY ? [liberalSpyPng, libColor] : [liberalPng,libColor]
  const getTeamImg = (player) => player.team === Team.FASC ? [fascPartyPng, fascColor] : [libPartyPng, libColor]
  const getVote = (player) => player.vote === Vote.JA ? jaPng : player.vote === Vote.NEIN ? neinPng : errorPng

  const renderPlayers = game?.players?.map((player, idx) => {
    let choosable = false
    let makingDecision = false
    let nameColor = hiddenColor
    let imgContent = roleBackPng
    let hideImgContent = gameOver
    let overlayContent = null
    let overlayContentFlip = null
    let animation = ''

    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(invName => invName === player.name)

    if(choosing && player.name !== name){
      if(game.status === Status.LIB_SPY_GUESS){
        choosable = player.team === Team.LIB || (!game.settings.hitlerKnowsFasc && player.role !== Role.HITLER)
      }
      else if(!player.alive){
        choosable = false
      }
      else if(game.status === Status.CHOOSE_CHAN){
        choosable = game.prevChan !== player.name && game.prevPres !== player.name
      }
      else if(game.status === Status.INV){
        choosable = !player.investigated
      }
      else{
        choosable = true
      }
    }

    if(game.currentPres === player.name){
      if(game.status === Status.CHOOSE_CHAN || game.status === Status.PRES_DISCARD || game.status === Status.PRES_CLAIM || game.status === Status.GUN || game.status === Status.INSPECT_TOP3 || game.status === Status.INV || game.status === Status.INV_CLAIM || game.status === Status.VETO_REPLY || game.status === Status.SE){
        makingDecision = true
      }
    }
    if(game.currentChan === player.name){
      if(game.status === Status.CHAN_PLAY || game.status === Status.CHAN_CLAIM || game.status === Status.VETO_DECLINED ){
        makingDecision = true
      }
    }
    if(game.status === Status.VOTE && !player.vote && player.alive){
      makingDecision = true
    }
    if(game.status === Status.LIB_SPY_GUESS && player.role === Role.HITLER){
      makingDecision = true
    }

    let showDueToInv = false
    //your own role
    if(player.name === name){
      [imgContent, nameColor] = showOwnRole(player) ? getRoleImg(player) : [roleBackPng, hiddenColor]
    }
    //fasc see other fasc
    else if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
      [, nameColor] = getRoleImg(player)
    }
    else if(thisPlayerInvestigatedPlayer){
      [, nameColor] = getTeamImg(player)
      showDueToInv = true
    }

    if(game.status === Status.STARTED){
      if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
        [imgContent, nameColor] = getRoleImg(player)
      }
    }
    // else if(game.status === Status.VOTE){
    //   imgContent = voteBackPng
    // }
    // else if(game.status === Status.SHOW_VOTE_RESULT && player.alive){
    //   imgContent = getVote(player)
    // }
    // else if(game.status === Status.SHOW_INV_CHOICE && player.name === currentPres.investigations.slice(-1)[0]){
    //   imgContent = partyBack
    //   nameColor = showDueToInv ? hiddenColor : nameColor
    // }
    //during inv claim, pres who chose the player to inv sees their party back and their name color unless hitler, keep as is
    // else if(game.status === Status.INV_CLAIM && thisPlayer.name === currentPres.name && player.name === currentPres.investigations.slice(-1)[0]){
    //   imgContent = getTeamImg(player)[0]
    //   nameColor = nameColor === hitlerColor ? nameColor : getTeamImg(player)[1]
    // }
    // else if(game.status === Status.LIB_SPY_GUESS && player.role === Role.HITLER){
    //   [imgContent, nameColor] = getRoleImg(player)
    // }
    // else if(game.status === Status.SHOW_LIB_SPY_GUESS && player.guessedToBeLibSpy){
    //   imgContent = partyBack
    // }
    else if(gameOver){
      [,nameColor] = getRoleImg(player)
    }


    if(game.status === Status.STARTED){
      if(player.name === name){
        overlayContent = roleBackPng
        overlayContentFlip = getRoleImg(player)[0]
        hideImgContent = true
        animation = 'flip 4s forwards 1s'
      }
      if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
        overlayContent = roleBackPng
        overlayContentFlip = getRoleImg(player)[0]
        hideImgContent = true
        animation = 'flipAndUnflip 4s forwards 1s'
      }
    }
    else if(game.status === Status.VOTE){
      if(player.alive){
        overlayContent = voteBackPng
        animation = 'up 1s forwards'
      }
    }
    else if(game.status === Status.SHOW_VOTE_RESULT){
      if(player.alive){
        overlayContent = voteBackPng
        overlayContentFlip = getVote(player)
        animation = 'flipAndDown 3s forwards'
      }
    }
    else if(game.status === Status.SHOW_INV_CHOICE && player.name === currentPres.investigations.slice(-1)[0]){
      if(currentPres.name === name){
        nameColor = showDueToInv ? hiddenColor : nameColor
        overlayContent = getTeamImg(player)[0]
      }
      else{
        overlayContent = partyBack
      }
      animation = 'upAndDown 3s forwards'
    }
    else if(game.status === Status.LIB_SPY_GUESS && player.role === Role.HITLER){
      nameColor = hitlerColor
      overlayContent = roleBackPng
      overlayContentFlip = hitlerPng
      animation = 'flip 2s forwards'
      hideImgContent = true
    }
    else if(game.status === Status.SHOW_LIB_SPY_GUESS){
      const spyGuessedPlayer = game.players.find(player => player.guessedToBeLibSpy)
      if(spyGuessedPlayer.name === player.name){
        overlayContent = roleBackPng
        overlayContentFlip = getRoleImg(player)[0]
        animation = 'flip 2s forwards'
        hideImgContent = true
      }
    }
    else if(gameOver){
      //flip over everyone elses role, unless blind in which case your needs flipping too if not confirmed
      if(player.name !== name || (game.settings.type === GameType.BLIND && !player.confirmedFasc)){
        overlayContent = roleBackPng
        overlayContentFlip = getRoleImg(player)[0]
        animation = 'flip 4s forwards 1s'
      }
      else{
        overlayContent = getRoleImg(player)[0]
        overlayContentFlip = getRoleImg(player)[0]
        animation = 'still .1s forwards'
      }
    }

    const flipAndDownkeyFrameStyles = flipAndDownAnimation(playersDimensions.y)
    const upKeyFrameStyles = upAnimation(playersDimensions.y)
    const flipKeyFrameStyles = flipAnimation()
    const upAndDownKeyFrameStyles = upAndDownAnimation(playersDimensions.y)
    const flipAndUnflipStyles = flipAndUnflipAnimation()
    const stillKeyFrameStyles = stillAnimation()

    return (
    <Grid key={idx} item xs={12/game.players.length} sx={{}}>
      <Box sx={{opacity: player.socketId? 1 : .3, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Typography maxWidth='80%' sx={{fontSize: `calc(${playersDimensions.x}px / ${8*n})`, color: nameColor, whiteSpace: 'nowrap', fontFamily: 'inter', fontWeight: 400, overflow: 'hidden'}}>{idx+1}. {player.name}</Typography>
        <Card data-key={player.name} onClick={choosing && choosable ? handleChoosePlayer : ()=>{}} sx={{cursor: choosable ? 'pointer' : 'auto', boxShadow: choosable ? '0 0 0 3px orange' : 'none', display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: 'rgb(46, 109, 28)'}}>
          <style>{flipAndDownkeyFrameStyles}</style>
          <style>{upKeyFrameStyles}</style>
          <style>{flipKeyFrameStyles}</style>
          <style>{upAndDownKeyFrameStyles}</style>
          <style>{flipAndUnflipStyles}</style>
          <style>{stillKeyFrameStyles}</style>
          <img ref={el => imageRefs.current[idx] = el} className='player-card' src={imgContent} draggable='false' style={{maxWidth: "100%", borderRadius: playersDimensions.y/32, visibility: hideImgContent ? 'hidden' : 'visible' }}/>
          <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', perspective: 1000, bottom: -playersDimensions.y, transformStyle: 'preserve-3d', animation}}>
            <img src={overlayContent} draggable='false' style={{maxWidth: "100%", borderRadius: playersDimensions.y/32, position: 'absolute', backfaceVisibility: 'hidden'}}/>
            <img src={overlayContentFlip} draggable='false' style={{maxWidth: "100%", borderRadius: playersDimensions.y/32, position: 'absolute', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',  }}/>
          </div>
          {!gameOver &&
            <>
          {game.currentPres === player.name && <img src={presPng} draggable='false' style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.currentChan === player.name && <img src={chanPng} draggable='false' style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.prevPres === player.name && <img src={presPng} draggable='false' style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
          {game.prevChan === player.name && <img src={chanPng} draggable='false' style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
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
    //not factoring on the height of the name label so can't use the 1.36, minWidth: 400?
    <Box ref={playersRef} sx={{width: {xs: `calc(20vh / 2.2 * ${n})`, sm: `calc((100vh - (56px + ${boardDimensions.y}px)) / 1.8 * ${n} )`}, minWidth: {sm: 600, md: 650}, maxWidth: `calc(140px * ${n})`}}>
        <Grid container spacing={{xs: .5, sm: 1}}>
          {renderPlayers}
        </Grid>
    </Box>

  )
}