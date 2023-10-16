import React, {useState} from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText, Badge, Modal } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import fasc5PlayerBoard from '../img/fasc5PlayerBoard.png'
import fasc7PlayerBoard from '../img/fasc7PlayerBoard.png'
import fasc9PlayerBoard from '../img/fasc9PlayerBoard.png'
import libBoard from '../img/libBoard.png'
import libPolicy from '../img/LibPolicy.png'
import fascPolicy from '../img/FascPolicy.png'
import PolicyBack from '../img/PolicyBack.png';
import { POLICY_WIDTH } from '../consts';
import Action from './Action';

const boardWidth = 600

const fascBottom = 285
const fascLeft = 59
const libBottom = 60
const libLeft = 101
const trackerGap = 55.5
const trackerBottom = 30.5
const trackerLeft = 202.3
const deckBottom = 0
const deckLeft = 600


export default function Board({game, name, id, setError, showInvCard, boardRef, imageRefs}) {
  const fascBoard = game.players.length < 7 ? fasc5PlayerBoard : game.players.length < 9 ? fasc7PlayerBoard : fasc9PlayerBoard
  const [blur, setBlur] = useState(false)

  const fascPolicies = []
  for(let i = 0; i < game.FascPoliciesEnacted; i++){
    fascPolicies.push(<img key={i} src={fascPolicy} style={{ width: POLICY_WIDTH }}/>)
  }
  const libPolicies = []
  for(let i = 0; i < game.LibPoliciesEnacted; i++){
    libPolicies.push(<img key={i} src={libPolicy} style={{ width: POLICY_WIDTH }}/>)
  }

  return (
    <>
      <Box sx={{width: {xs: '100vw', sm: '50vw'}, maxWidth: {sm: `calc((65vh - 30px) * 1.3)`, md: 600}, display: 'flex', flexDirection: 'column', position: 'relative'}}>
        <Action game={game} name={name} id={id} setError={setError} blur={blur} setBlur={setBlur} showInvCard={showInvCard}/>
        <Box ref={boardRef} sx={{filter: blur ? 'blur(5px)' : 'blur(0)', zIndex: -1, display: 'flex', flexDirection: 'column'}}>
          <img ref={el => imageRefs.current[0] = el} key={1} src={fascBoard} draggable='false' style={{ maxWidth: "100%"}}/>
          <img ref={el => imageRefs.current[1] = el} key={2} src={libBoard} draggable='false' style={{ maxWidth: "100%" }}/>
          <Box sx={{position: 'absolute', bottom: fascBottom, left: fascLeft, display: 'flex', gap: .8}}>
            {fascPolicies}
          </Box>
          <Box sx={{position: 'absolute', bottom: libBottom, left: libLeft, display: 'flex', gap: 1}}>
            {libPolicies}
          </Box>
          <CircleIcon sx={{color: 'blue', position: 'absolute', bottom: trackerBottom, left: trackerLeft + game.tracker * trackerGap}}/>
        </Box>
      </Box>


    </>
  )
}

