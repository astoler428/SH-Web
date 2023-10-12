import * as React from 'react';
import Box from '@mui/material/Box';
import {Card, CardHeader, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libParty from '../img/LibParty.png'
import fascParty from '../img/FascParty.png'
import { Role, GameType, Team, Status } from '../consts';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2
};

export default function RoleModal({thisPlayer, game, roleOpen, setRoleOpen, setConfirmFascOpen}) {
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

  return (
    <div>
      <Modal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton onClick={()=>setRoleOpen(false)} aria-label="close" sx={{position: 'absolute', right: 2, top: 2}}>
              <CloseIcon/>
          </IconButton>
          {game.settings.type === GameType.MIXED_ROLES && <img src={teamImg} draggable='false' style={{ maxWidth: "100%", width: '200px', maxHeight: "calc(100vh - 64px)" }}/>}
          <img src={roleImg} draggable='false' style={{ maxWidth: "100%", width: '200px', maxHeight: "calc(100vh - 64px)" }}/>
          {game.settings.type === GameType.BLIND && !thisPlayer.confirmedFasc && !gameOver && <Button onClick={() => setConfirmFascOpen(true)} variant='contained' color='error'>Confirm Fasc</Button>}
        </Box>
      </Modal>
    </div>
  );
}

/**
 * make ax x button by turning into card with header and action?
 * Or just position absolute
 * Make so if confirm fasc loses - modal closes automatically
 */