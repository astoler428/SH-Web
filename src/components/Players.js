import React from 'react'
import {Status, Role, Team, GameType, Vote} from '../consts'
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
//visibity: hidden]

/**
 * default content is cardBack
 *
 * options:
 * may be a full role if it's you or a fellow fasc
 * maybe a team party on inv
 *
 * loading if waiting on action - vote, current pres
 * Ja or Nein if time to display the vote
 *
 * end of game reveal all roles
 *
 * need to figure out how to show whether the other fasc have confirmed themselves or not
 *
 */
const hitlerColor = 'darkred'
const fascColor = 'red'
const libColor = 'blue'
const hiddenColor = 'black'

export default function Players({name, game, handleChoosePlayer, showInvCard, setShowInvCard}) {
  const choosing = game.currentPres === name &&
  (game.status === Status.CHOOSE_CHAN ||
   game.status === Status.INV ||
   game.status === Status.SE ||
   game.status === Status.GUN)

  const thisPlayer = game.players.find(player => player.name === name)
  const currentPres = game.players.find(player => player.name === game.currentPres)
  const getRoleImg = (player) => player.role === Role.HITLER ? [hitlerPng,hitlerColor] : player.role === Role.FASC ? [fascistPng,fascColor] : player.role === Role.LIB_SPY ? [liberalSpyPng, libColor] : [liberalPng,libColor]
  const getTeamImg = (player) => player.team === Team.FASC ? [fascPartyPng, fascColor] : [libPartyPng, libColor]
  const getVote = (player) => player.vote === Vote.JA ? jaPng : player.vote === Vote.NEIN ? neinPng : errorPng
  const renderPlayers = game?.players?.map((player, idx) => {
    let choosable = false, makingDecision = false, nameColor = hiddenColor
    const thisPlayerInvestigatedPlayer = thisPlayer.investigations.some(invName => invName === player.name)
    if(choosing && player.name !== name && player.alive){
      if(game.status === Status.CHOOSE_CHAN){
        if(game.prevChan !== player.name && game.prevPres !== player.name){
          choosable = true
        }
      }
      else if(game.status === Status.INV){
        if(!player.investigated){
          choosable = true
        }
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

    let imgContent =  roleBackPng
    //your own role
    if(player.name === name){
      [imgContent, nameColor] = showOwnRole(player) ? getRoleImg(player) : [roleBackPng, hiddenColor]
    }
    //fasc see other fasc
    else if(player.team === Team.FASC && thisPlayer.team === Team.FASC && showOtherFasc(thisPlayer, player)){
      [imgContent, nameColor] = getRoleImg(player)
      // if(player.confirmedFasc){
      //   cls += ` confirmed `
      // }
    }
    else if(thisPlayerInvestigatedPlayer){
      [imgContent, nameColor] = getTeamImg(player)
    }
    if(game.status === Status.VOTE){
      imgContent = voteBackPng
    }

    if(game.status === Status.VOTE_RESULT && player.alive){
      imgContent = getVote(player)
    }

    if(game.status === Status.INV_CLAIM && player.name === currentPres.investigations.slice(-1)[0] && showInvCard){
      imgContent = partyBack
      setTimeout(()=>{
        setShowInvCard(false)
      },2000)
    }

    if(game.status === Status.END_FASC || game.status === Status.END_LIB){
      [imgContent,nameColor] = getRoleImg(player)
    }

    /**
     * import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect } from "react";

const ResponsiveButton = (props) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));

  const sizes = () => {
    if (desktop) return "large";
    if (tablet) return "medium";
    if (mobile) return "small";
  };

  return <Button {...props} size={sizes()}/>;
};
export default ResponsiveButton;
     */

    return (
    <Grid key={idx} item xs={12/game.players.length} sx={{}}>
      <Box sx={{opacity: player.socketId? 1 : .3, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Typography maxWidth='80%' sx={{fontSize: {xs: '7px', sm: '16px'}, color: nameColor, whiteSpace: 'nowrap', overflow: 'hidden', textDecoration: player.name === name ? 'underline' : 'none'}}>{idx+1}. {player.name}</Typography>
        <Card data-key={player.name} onClick={handleChoosePlayer} sx={{cursor: choosable ? 'pointer' : 'auto', border: choosable ? '4px solid lightgreen' : 'none', display: 'flex', flexDirection: 'column', position: 'relative'}}>
          <img className='player-card' src={imgContent} draggable='false' style={{maxWidth: "100%", }}/>
          {game.status !== Status.END_FASC && game.status !== Status.END_LIB &&
            <>
          {game.currentPres === player.name && <img src={presPng} draggable='false' style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.currentChan === player.name && <img src={chanPng} draggable='false' style={{maxWidth: "100%", position: 'absolute', bottom: 0}}/>}
          {game.prevPres === player.name && <img src={presPng} draggable='false' style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
          {game.prevChan === player.name && <img src={chanPng} draggable='false' style={{opacity: .3, maxWidth: "100%", position: 'absolute', top: 0}}/>}
          {makingDecision &&
          <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <CircularProgress viewBox="30 30 30 30" style={{color: 'white', width: '30px', height: '30px'}} />
            {/* figured it out - just needed to switch to style */}
            {/* set thickness 3.6 default */}
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
      return otherFasc.confirmedFasc || otherFasc.role === Role.HITLER ? true : false
    }
    return false
  }

  let h = '100vh - 600px'
  let n = game.players.length
  return (
    <Box maxWidth={`calc((${h})/(1.41)*${n})`} sx={{width: 'calc(100vw - 100px)'}}>
        <Grid container spacing={{xs: .5, sm: 1}}>
          {renderPlayers}
        </Grid>
    </Box>

  )
}