import React, {useState} from 'react'
import {IconButton, Snackbar, Typography, Box, Button, ButtonGroup} from '@mui/material'
import {post} from '../api/api'
import { ClaimType, CHAN2, PRES3, Team } from '../consts'

export default function Claim({claimType, id}) {
  let title, content, handleClickEvent

  const threePoliciesClaim =
    <>
      <Button data-key={PRES3.RRR} color='error'>3 Fascist policies</Button>
      <Button data-key={PRES3.RRB} color='inherit' sx={{lineHeight: '18px'}}>3 Fascist and a Liberal policy</Button>
      <Button data-key={PRES3.RBB} sx={{lineHeight: '18px', backgroundColor: 'lightskyblue'}}>2 Liberal and a Fascist policy</Button>
      <Button data-key={PRES3.BBB} color='primary'>3 Liberal policies</Button>
    </>

  const twoPoliciesClaim =
    <>
      <Button data-key={CHAN2.RR} color='error'>2 Fascist policies</Button>
      <Button data-key={CHAN2.RB} color='inherit' sx={{lineHeight: '18px'}}>A Fascist and a Liberal policy</Button>
      <Button data-key={CHAN2.BB} color='primary'>2 Liberal policies</Button>
    </>

  const invClaim =
    <>
      <Button data-key={Team.LIB} color='primary'>Liberal</Button>
      <Button data-key={Team.FASC} color='error'>Fascist</Button>
    </>

  switch (claimType){
    case ClaimType.PRES:
      title = 'AS PRESIDENT, I DREW...'
      content = threePoliciesClaim
      handleClickEvent = handlePresClaim
      break
    case ClaimType.CHAN:
      title = 'AS CHANCELLOR, I RECEIVED...'
      content = twoPoliciesClaim
      handleClickEvent = handleChanClaim
      break
    case ClaimType.INV:
      title = 'THIS PLAYER IS ON TEAM...'
      content = invClaim
      handleClickEvent = handleInvClaim
      break
    case ClaimType.INSPECT_TOP3:
      title = 'THE TOP 3 POLICIES ARE...'
      content = threePoliciesClaim
      handleClickEvent = handleInspect3Claim
      break
  }


  async function handlePresClaim(e){
    const claim = e.target.getAttribute('data-key')
    await post(`/game/presClaim/${id}`, {claim})
  }

  async function handleChanClaim(e){
    const claim = e.target.getAttribute('data-key')
    await post(`/game/chanClaim/${id}`, {claim})
  }

  async function handleInvClaim(e){
    const team = e.target.getAttribute('data-key')
    await post(`/game/invClaim/${id}`, {claim: team})
  }

  async function handleInspect3Claim(e){
    const claim = e.target.getAttribute('data-key')
    await post(`/game/inspect3Claim/${id}`, {claim})
  }

  return (
    <Box sx={{width: 600, position: 'absolute', width: '100%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Typography sx={{fontSize: '30px', textAlign: 'center', display: 'flex'}}>{title}</Typography>
      <Box sx={{display: 'flex', gap:4, justifyContent: 'center', alignItems: 'center', height: 300}}>
        <ButtonGroup onClick={handleClickEvent} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
          {content}
        </ButtonGroup>
      </Box>
      {/* hide duration not working and no displaying in the bottom left */}
    </Box>
  )
}
