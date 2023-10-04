import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import hitlerPng from '../img/Hitler.png'
import liberalPng from '../img/Liberal.png'
import fascistPng from '../img/Fascist.png'
import roleBackPng from '../img/RoleBack.png'
import libParty from '../img/LibParty.png'
import fascParty from '../img/FascParty.png'
import { Role, GameType, Team } from '../consts';

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

export default function RoleModal({thisPlayer, roleOpen, setRoleOpen, gameType, handleConfirmFasc}) {
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
  if(gameType === GameType.BLIND && !thisPlayer.confirmedFasc){
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
          <img src={roleImg} style={{ maxWidth: "100%", width: '200px', maxHeight: "calc(100vh - 64px)" }}/>
          {gameType === GameType.MIXED_ROLES && <img src={teamImg} style={{ maxWidth: "100%", width: '200px', maxHeight: "calc(100vh - 64px)" }}/>}
          {gameType === GameType.BLIND && !thisPlayer.confirmedFasc && <Button onClick={handleConfirmFasc} variant='contained' color='error'>Confirm Fasc</Button>}
        </Box>
      </Modal>
    </div>
  );
}