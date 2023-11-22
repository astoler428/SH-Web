import React from 'react'
import {Box, Typography} from '@mui/material'
import { GameType, Status } from '../consts'

export default function StatusMessage({game}) {
  let message
  const status = game.status

  switch (status){
    case Status.STARTED:
      message = game.settings.type === GameType.BLIND ? 'Roles are hidden' : 'Showing roles'
      break
    case Status.CHOOSE_CHAN:
      message = 'President to select chancellor'
      break
    case Status.VOTE:
      message = 'Players to vote'
      break
    case Status.SHOW_VOTE_RESULT:
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
      message = 'Waiting on president to investigate'
      break
    case Status.INV_CLAIM:
      message = 'Waiting on president to claim investigation'
      break
    case Status.SE:
      message = 'Waiting on president to special elect'
      break
    case Status.GUN:
      message = 'Waiting on president to shoot'
      break
    case Status.INSPECT_TOP3:
      message = 'Waiting on president to claim top 3 policies'
      break
    case Status.VETO_REPLY:
      message = 'Waiting on president to decide on veto'
      break
    case Status.LIB_SPY_GUESS:
      message = 'Waiting on Hitler to guess the liberal spy'
      break
    case Status.END_FASC:
    case Status.END_LIB:
      const winners = game.status === Status.END_FASC ? "Fascists" : "Liberals"
      message = `Game over. ${winners} win`
      break
  }

  return (
    <Box sx={{height: {xs: 30, sm: 30, md: 40}, width: '100%', backgroundColor: '#171717', borderBottom: '2px outset gray', display:'flex', alignItems: 'center'}}>
      <Typography sx={{color: '#f5f5f5', marginLeft: '4px', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: {xs: '18px', sm: '18px', md: '20px'}}}>{message}</Typography>
    </Box>
  )
}
