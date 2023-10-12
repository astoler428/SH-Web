import React, {useState, useEffect} from 'react'
import {IconButton, Snackbar, Button, ButtonGroup, Typography, Box, Container} from '@mui/material'
import libPolicyPng from '../img/LibPolicy.png'
import fascPolicyPng from '../img/FascPolicy.png'
import jaPng from '../img/Ja.png'
import neinPng from '../img/Nein.png'
import { Color, POLICY_WIDTH, PRES3, CHAN2, Status, Vote, Team, Role, GameType } from '../consts'
import {post} from '../api/api'
import DefaulDiscardDialog from './DefaultDiscardDialog'


export default function Action({game, name, id, setError, blur, setBlur}) {
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const voteWidth = 150
  const isCurrentPres = game.currentPres === name
  const isCurrentChan = game.currentChan === name
  const thisPlayer = game.players.find(player => player.name === name)
  const inVetoZone = game.FascPoliciesEnacted === 5
  let title, content, _blur = true, showDefaultOption = false
  if(game.status === Status.VOTE){
    if(thisPlayer.alive){
      title = 'SELECT A VOTE.'
      content = showVoteCards()
    }
    else{
      _blur = false
    }
  }
  else if(isCurrentPres){
    showDefaultOption = game.settings.type === GameType.BLIND ? true : false
    switch(game.status){
      case Status.PRES_DISCARD:
        title = 'CHOOSE A POLICY TO DISCARD. '
        content = showPresPolicies()
        break
      case Status.PRES_CLAIM:
        title = 'AS PRESIDENT, I DREW...'
        content = showPresClaims()
        break
      case Status.INV_CLAIM:
        title = 'THIS PLAYER IS ON TEAM...'
        content = showInvClaims()
        break
      case Status.INSPECT_TOP3:
        title = 'THE TOP 3 POLICIES ARE...'
        content = showInspect3PoliciesAndClaims()
        break
      case Status.VETO_REPLY:
        title = `THE CHANCELLOR REQUESTS A VETO. ACCEPT OR DECLINE.`
        content = showVetoOptions()
        break
      default:
        _blur = false
        showDefaultOption = false
    }
  }
  else if(isCurrentChan){
    showDefaultOption = game.settings.type === GameType.BLIND ? true : false
    switch(game.status){
      case Status.CHAN_PLAY:
        title = `CHOOSE A POLICY TO PLAY${inVetoZone ? ` OR REQUEST A VETO.` : `.`}`
        content = showChanPolicies()
        break
      case Status.VETO_DECLINED:
        title = `VETO WAS DECLINED. CHOOSE A POLICY TO PLAY.`
        content = showChanPolicies()
        break
      case Status.CHAN_CLAIM:
        title = 'AS CHANCELLOR, I RECEIVED...'
        content = showChanClaims()
        break
      default:
        _blur = false
        showDefaultOption = false
    }
  }
  else{
    _blur = false
  }

  useEffect(()=>{
    if(blur !== _blur){
      setBlur(_blur)
    }
  })


  function showVoteCards(){
    const jaVote = thisPlayer.vote === Vote.JA
    const neinVote = thisPlayer.vote === Vote.NEIN
    return (
      <>
        <img onClick={()=> handleVote(Vote.JA)} src={jaPng} draggable='false' style={{width: jaVote ? voteWidth + 20 : voteWidth, border: jaVote ? '6px solid green' : 'none', borderRadius: '10px', cursor: 'pointer' }}/>
        <img onClick={()=> handleVote(Vote.NEIN)} src={neinPng} draggable='false' style={{width: neinVote ? voteWidth + 20 : voteWidth,  border: neinVote ? '6px solid green' : 'none', borderRadius: '10px', cursor: 'pointer' }}/>
      </>
    )
  }


  function showPresPolicies(){
    return game.presCards.map(card => {
      const policyImg = getPolicyImg(card)
      return (
          <img key={Math.random()} data-key={card.color} onClick={handlePresDiscard} src={policyImg} draggable='false' style={{width: POLICY_WIDTH, borderRadius: '10px', cursor: 'pointer' }}/>
      )
    })
  }
  function showChanPolicies(){
    const chanCards = game.chanCards.map(card => {
      const policyImg = getPolicyImg(card)
      return (
          <img key={Math.random()} data-key={card.color} onClick={handleChanPlay} src={policyImg} draggable='false' style={{width: POLICY_WIDTH, borderRadius: '10px', cursor: 'pointer' }}/>
      )
    })
    return (
        <>
      {chanCards}
      {inVetoZone && game.status !== Status.VETO_DECLINED && <Button variant='contained' onClick={handleVetoRequest}>Request veto</Button>}
      </>
    )
  }

  function showPresClaims(){
    return (
    <ButtonGroup onClick={handlePresClaim} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
      <Button data-key={PRES3.RRR} color='error'>3 Fascist policies</Button>
      <Button data-key={PRES3.RRB} color='inherit' sx={{lineHeight: '18px'}}>2 Fascist and a Liberal policy</Button>
      <Button data-key={PRES3.RBB} sx={{lineHeight: '18px', backgroundColor: 'lightskyblue'}}>2 Liberal and a Fascist policy</Button>
      <Button data-key={PRES3.BBB} color='primary'>3 Liberal policies</Button>
    </ButtonGroup>
    )
  }

  function showChanClaims(){
    return (
    <ButtonGroup onClick={handleChanClaim} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
      <Button data-key={CHAN2.RR} color='error'>2 Fascist policies</Button>
      <Button data-key={CHAN2.RB} color='inherit' sx={{lineHeight: '18px'}}>A Fascist and a Liberal policy</Button>
      <Button data-key={CHAN2.BB} color='primary'>2 Liberal policies</Button>
    </ButtonGroup>
    )
  }

  function showInvClaims(){
    return (
    <ButtonGroup onClick={handleInvClaim} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
      <Button data-key={Team.LIB} color='primary'>Liberal</Button>
      <Button data-key={Team.FASC} color='error'>Fascist</Button>
    </ButtonGroup>
    )
  }

  function showInspect3PoliciesAndClaims(){
    const top3 = game.top3.map(card => {
      const policyImg = getPolicyImg(card)
      return (
          <img key={Math.random()} src={policyImg} draggable='false' style={{width: POLICY_WIDTH, borderRadius: '10px'}}/>
      )
    })
    return (
      <>
        {top3}
      <ButtonGroup onClick={handleInspect3Claim} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
        <Button data-key={PRES3.RRR} color='error'>3 Fascist policies</Button>
        <Button data-key={PRES3.RRB} color='inherit' sx={{lineHeight: '18px'}}>3 Fascist and a Liberal policy</Button>
        <Button data-key={PRES3.RBB} sx={{lineHeight: '18px', backgroundColor: 'lightskyblue'}}>2 Liberal and a Fascist policy</Button>
        <Button data-key={PRES3.BBB} color='primary'>3 Liberal policies</Button>
      </ButtonGroup>
     </>
    )
  }

  function showVetoOptions(){
    return (
    <ButtonGroup onClick={handleVetoReply} orientation='vertical' variant='contained' sx={{width: 250, gap: 2}}>
      <Button data-key={true} color='primary'>Accept</Button>
      <Button data-key={false} color='error'>Decline</Button>
    </ButtonGroup>
    )
  }


  function getPolicyImg(card){
    return card.color === Color.RED ? fascPolicyPng : libPolicyPng
  }



  async function handleVote(vote){
    await post(`/game/vote/${id}`, {name, vote})
  }

  async function handlePresDiscard(e){
    // const policy = e.target.closest('.MuiBox-root');
    const cardColor = e.target.getAttribute('data-key')
    if(validDiscardDueToMixedRole(cardColor)){
      await post(`/game/presDiscard/${id}`, {cardColor})
    }
    else{
      setError(`You cannot discard a ${cardColor} policy.`)
    }
  }

  async function handleChanPlay(e){
    // const policy = e.target.closest('.MuiBox-root');
    const cardColor = e.target.getAttribute('data-key')
    if(validPlayDueToMixedRole(cardColor)){
      await post(`/game/chanPlay/${id}`, {cardColor})
    }
    else{
      setError(`You cannot play a ${cardColor} policy.`)
    }
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

  async function handleVetoRequest(){
    await post(`/game/vetoRequest/${id}`)
  }

  async function handleVetoReply(e){
    const vetoAccepted = e.target.getAttribute('data-key') === 'true'
    await post(`/game/vetoReply/${id}`, {vetoAccepted})
  }

  async function handleDefaultAction(){
    if(game.status === Status.PRES_DISCARD){
      setShowDiscardDialog(true)
    }
    if(game.status === Status.VETO_DECLINED){
      await post(`/game/default/${Status.CHAN_PLAY}/${id}`)
    }
    else{
      await post(`/game/default/${game.status}/${id}`)
    }
  }


  function validDiscardDueToMixedRole(cardColor){
    if(game.settings.type !== GameType.MIXED_ROLES){
      return true
    }
    if(thisPlayer.team === Team.LIB && thisPlayer.role === Role.FASC){
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.BLUE || game.presCards.every(card => card.color === Color.RED)
    }
    else if(thisPlayer.team === Team.FASC && thisPlayer.role === Role.LIB){
      //fasc who has to play blue unless all red
      return cardColor === Color.RED || game.presCards.every(card => card.color === Color.BLUE)
    }
    return true
  }


  function validPlayDueToMixedRole(cardColor){
    if(game.settings.type !== GameType.MIXED_ROLES){
      return true
    }
    if(thisPlayer.team === Team.LIB && thisPlayer.role === Role.FASC){
      //lib who has to play red is either discarding a blue or they are all red
      return cardColor === Color.RED || game.chanCards.every(card => card.color === Color.BLUE)
    }
    else if(thisPlayer.team === Team.FASC && thisPlayer.role === Role.LIB){
      //fasc who has to play blue unless all red
      return cardColor === Color.BLUE || game.chanCards.every(card => card.color === Color.RED)
    }
    return true
  }

  return (
    <Box style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%' }}>
      <Box sx={{width: 600, position: 'absolute', width: '100%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5}}>
        <Typography sx={{fontSize: '30px', textAlign: 'center', display: 'flex'}}>{title}</Typography>
        <Box sx={{display: 'flex', gap:4, justifyContent: 'center', alignItems: 'center'}}>
          {content}
        </Box>
        <Box>
          {showDefaultOption && <Button variant='contained' onClick={handleDefaultAction}>Default to Role</Button>}
        </Box>
      </Box>
      <DefaulDiscardDialog showDiscardDialog={showDiscardDialog} setShowDiscardDialog={setShowDiscardDialog} presDiscard={game.presDiscard}/>
    </Box>
  )
}

