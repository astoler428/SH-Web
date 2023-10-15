import React from 'react'
import {Box, Typography} from '@mui/material'
import { Status } from '../consts'

export default function StatusMessage({game, name}) {
  let message
  const status = game.status
  const isCurrentPres = game.currentPres === name
  const isCurrentChan = game.currentChan === name
  const thisPlayer = game.players.find(player => player.name === name)


  switch (status){
    case Status.CHOOSE_CHAN:
      message = isCurrentPres ? 'Choose an eligible chancellor' : 'President to select chancellor'
      break
    case Status.VOTE:
      message = 'Players to vote'
      break
    case Status.VOTE_RESULT:
      message = 'Tallying vote results'
      break
    case Status.PRES_DISCARD:
      message = 'Waiting on president to discard a policy'
      break
      case Status.CHAN_PLAY:
      case Status.VETO_DECLINED:
      message = 'Waiting on chancellor to enact'
      break
    case Status.CHAN_CLAIM:
      message = 'Waiting on chancellor claim'
      break
    case Status.PRES_CLAIM:
      message = 'Waiting on president claim'
      break
    case Status.INV:
      message = isCurrentPres ? 'Choose a player to investigate' : 'Waiting on president to investigate'
      break
    case Status.INV_CLAIM:
      message = 'Waiting on president to claim investigation'
      break
    case Status.SE:
      message = isCurrentPres ? 'Choose a player to become the next president' : 'Waiting on president to special elect'
      break
    case Status.GUN:
      message = isCurrentPres ? 'Choose a player to shoot' : 'Waiting on president to shoot'
      break
    case Status.INSPECT_TOP3:
      message = 'Waiting on president to claim the top 3 policies'
      break
    case Status.VETO_REPLY:
      message = 'Waiting on president to decide on veto'
      break
    case Status.END_FASC:
    case Status.END_LIB:
      const winners = game.status === Status.END_FASC ? "Fascists" : "Liberals"
      message = `Game over. ${winners} win`
      break
  }

  return (
    <Box sx={{height: {xs: 40, sm: 50}, width: 'calc(100vw - 100px)', maxWidth: '600px', backgroundColor: 'black', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Typography variant={{xs: 'h6', sm: 'h5'}} sx={{color: 'white'}}>{message}</Typography>
    </Box>
  )
}
