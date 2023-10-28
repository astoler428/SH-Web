import React from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText, Badge, Modal } from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';

export default function PolicyPiles({game, boardDimensions}) {
  // const horizontal = boardDimensions.x/35
  // const vertical = boardDimensions.x/3.3 //2.1
  const width = boardDimensions.x/9
  const countStyles = {position: 'absolute',
  top: 0,
  left: 0, color:
  'white',
  backgroundColor: 'black',
  fontFamily: 'inter',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: boardDimensions.x/27,
  height: boardDimensions.x/27,
  fontWeight: 'bold',
  borderRadius: boardDimensions.x/1200,
  fontSize: boardDimensions.x/36}

  return (
      <Box sx={{display: 'flex', gap: 1}}>
        <Box sx={{position: 'absolute', left: boardDimensions.x/34, bottom: boardDimensions.x/40, width}}>
          <img src={PolicyBack} draggable='false' style={{ width: '100%', borderRadius: boardDimensions.x/200 }}/>
          <Box sx={countStyles}>
            {game.deck.drawPile.length}
          </Box>
        </Box>
        <Box sx={{position: 'absolute', right: boardDimensions.x/44, bottom: boardDimensions.x/40, width}}>
          <img src={PolicyBack} draggable='false' style={{ width: '100%', borderRadius: boardDimensions.x/200 }}/>
          <Box sx={countStyles}>
            {game.deck.discardPile.length}
          </Box>
        </Box>
      </Box>
  )
}
