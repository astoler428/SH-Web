import React from 'react'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText, Badge, Modal } from '@mui/material'
import PolicyBack from '../img/PolicyBack.png';
import { POLICY_WIDTH } from '../consts';

export default function PolicyPiles({game}) {
  return (
      <Box sx={{position: 'relative', display: 'flex', gap: 1}}>
        <Box sx={{position: 'relative'}}>
          <img src={PolicyBack} draggable='false' style={{ width: POLICY_WIDTH }}/>
          <Box sx={{position: 'absolute', top: 0, left: 0, color: 'white', backgroundColor: 'black', textAlign: 'center', width: 25, height: 25, fontWeight: 'bold', fontSize: 18}}>
            {game.deck.drawPile.length}
          </Box>
        </Box>
        <Box sx={{position: 'relative'}}>
          <img src={PolicyBack} draggable='false' style={{ width: POLICY_WIDTH }}/>
          <Box sx={{position: 'absolute', top: 0, left: 0, color: 'white', backgroundColor: 'black', textAlign: 'center', width: 25, height: 25, fontWeight: 'bold', fontSize: 18}}>
            {game.deck.discardPile.length}
          </Box>
        </Box>
      </Box>
  )
}
