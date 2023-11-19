import * as React from 'react';
import {Box, Dialog, DialogActions, DialogContent} from '@mui/material';
import Button from '@mui/material/Button';
import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import liberalSpyPng from '../img/LiberalSpy.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libParty from '../img/LibParty.png'
import fascParty from '../img/FascParty.png'
import { Role, gameOver, GameType, Team, Status, inGov, claiming } from '../consts';

export default function RoleDialog({thisPlayer, game, roleOpen, setRoleOpen, setConfirmFascOpen}) {

  let roleImg, teamImg
  switch (thisPlayer?.role) {
    case Role.FASC:
      roleImg = fascistPng
      break
    case Role.LIB:
      roleImg = liberalPng
      break
    case Role.HITLER:
      roleImg = hitlerPng
      break
    case Role.LIB_SPY:
      roleImg = liberalSpyPng
      break
    default:
      roleImg = roleBackPng
  }
  if(game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver(game.status)){
    roleImg = roleBackPng
  }

  switch (thisPlayer?.team) {
    case Team.LIB:
      teamImg = libParty
      break
    case Team.FASC:
      teamImg = fascParty
      break
  }

  const disableConfirmFasc = inGov(game, thisPlayer.name) || game.currentPres === thisPlayer.name && game.status === Status.CHAN_CLAIM || claiming(game, thisPlayer.name)
  const confirmFascText = disableConfirmFasc ? 'Cannot confirm fasc until after claims' : 'confirm fasc'

  return (
    <Dialog
      open={roleOpen}
      onClose={() => setRoleOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {
        game.settings.type === GameType.MIXED_ROLES &&
        <Box sx={{width: {xs: 134.5, sm: 196}}}>
          <img src={teamImg} draggable='false' style={{ width: '100%', borderRadius: 12}}/>
        </Box>
        }
        <Box sx={{width: {xs: 140, sm: 200}}}>
          <img src={roleImg} draggable='false' style={{width: '100%'}}/>
        </Box>
      </DialogContent>
      {
      game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver(game.status) &&
      <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
        <Button disabled={disableConfirmFasc} onClick={()=>setConfirmFascOpen(true)} variant='contained' color='error'>{confirmFascText}</Button>
      </DialogActions>
      }
    </Dialog>
  );
}

