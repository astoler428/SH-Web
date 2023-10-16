import * as React from 'react';
import Box from '@mui/material/Box';
import {Card, CardHeader, IconButton, Dialog, DialogActions, DialogContent} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import liberalSpyPng from '../img/LiberalSpy.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libParty from '../img/LibParty.png'
import fascParty from '../img/FascParty.png'
import { Role, GameType, Team, Status, inGov, POLICY_WIDTH } from '../consts';

export default function RoleDialog({thisPlayer, game, roleOpen, setRoleOpen, setConfirmFascOpen}) {
  const gameOver = game?.status === Status.END_FASC || game?.status === Status.END_LIB
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
  if(game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver){
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

  const disableConfirmFasc = inGov(game, thisPlayer.name)
  const confirmFascText = disableConfirmFasc ? 'Cannot confirm fasc until after claims' : 'confirm fasc'

  return (
      <div>

    <Dialog
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogContent sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {game.settings.type === GameType.MIXED_ROLES && <img src={teamImg} draggable='false' style={{ maxWidth: "100%", width: POLICY_WIDTH*2, maxHeight: "calc(100vh - 64px)" }}/>}
          <img src={roleImg} draggable='false' style={{width: POLICY_WIDTH*2}}/>
        </DialogContent>
        <DialogActions sx={{display: 'flex', justifyContent: 'center'}}>
          {game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver && <Button disabled={disableConfirmFasc} onClick={()=>setConfirmFascOpen(true)} variant='contained' color='error'>{confirmFascText}</Button>}
        </DialogActions>
      </Dialog>
        </div>


    // <div >
    //   <Modal sx={{}}
    //     open={roleOpen}
    //     onClose={() => setRoleOpen(false)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box sx={style}>
    //       <IconButton onClick={()=>setRoleOpen(false)} aria-label="close" sx={{position: 'absolute', right: 2, top: 2}}>
    //           <CloseIcon/>
    //       </IconButton>
    //       {game.settings.type === GameType.MIXED_ROLES && <img src={teamImg} draggable='false' style={{ maxWidth: "100%", width: '200px', maxHeight: "calc(100vh - 64px)" }}/>}
    //       <img src={roleImg} draggable='false' style={{ maxWidth: "100%", width: '200px' }}/>
    //       {game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver && <Button disabled={disableConfirmFasc} onClick={()=>setConfirmFascOpen(true)} variant='contained' color='error'>{confirmFascText}</Button>}
    //     </Box>
    //   </Modal>
    // </div>
  );
}

/**
 * make ax x button by turning into card with header and action?
 * Or just position absolute
 * Make so if confirm fasc loses - modal closes automatically
 */