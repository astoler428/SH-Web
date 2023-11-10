import React, {useState, useEffect} from 'react'
import {IconButton, Snackbar, Button, Typography, Box, Container} from '@mui/material'
import libPolicyPng from '../img/LibPolicy.png'
import fascPolicyPng from '../img/FascPolicy.png'
import jaPng from '../img/Ja.png'
import neinPng from '../img/Nein.png'
import { Color, POLICY_WIDTH, PRES3, CHAN2, Status, Vote, Team, Role, GameType } from '../consts'
import {post} from '../api/api'
import DefaulDiscardDialog from './DefaultDiscardDialog'
import { orange } from '@mui/material/colors'


export default function Action({game, name, id, setError, blur, setBlur, boardDimensions}) {
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [centerContent, setCenterContent] = useState(false)
  const [actionContent, setActionContent] = useState(false)
  const [actionTitle, setActionTitle] = useState(false)
  const [showTop3PoliciesNotClaim, setShowTop3PoliciesNotClaim] = useState(true) //first show policies
  const isCurrentPres = game.currentPres === name
  const isCurrentChan = game.currentChan === name
  const thisPlayer = game.players.find(player => player.name === name)
  const isHitler = thisPlayer.role === Role.HITLER
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
  else if(game.status === Status.LIB_SPY_GUESS && isHitler){
    title = 'GUESS THE LIBERAL SPY.'
    _blur = false
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
        if(showTop3PoliciesNotClaim){
          showDefaultOption = false
        }
        break
      case Status.VETO_REPLY:
        title = `THE CHANCELLOR REQUESTS A VETO. ACCEPT OR DECLINE.`
        content = showVetoOptions()
        break

      case Status.CHOOSE_CHAN:
        title = `CHOOSE AN ELIGIBLE CHANCELLOR.`
        _blur = false
        showDefaultOption = false
        break
      case Status.INV:
        title = `CHOOSE A PLAYER TO INVESTIGATE.`
        _blur = false
        showDefaultOption = false
        break
      case Status.SE:
        title = `CHOOSE A PLAYER TO BECOME THE NEXT PRESIDENT.`
        _blur = false
        showDefaultOption = false
        break
      case Status.GUN:
        title = `CHOOSE A PLAYER TO SHOOT.`
        _blur = false
        showDefaultOption = false
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
        _blur = false //in use effect it get set
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
    setActionContent(content)
    setActionTitle(title)
    setCenterContent(false)
    if(game.status !== Status.CHAN_CLAIM || !isCurrentChan){
      setTimeout(() => {
        setCenterContent(true)
        if(blur !== _blur){
          setBlur(_blur)
        }
      }, 50)
    }

    if(game.status === Status.CHAN_CLAIM && isCurrentChan){
      setCenterContent(false)
      setBlur(false)
      setTimeout(() => {
        setCenterContent(true)
        setBlur(true)
      }, 3000)
    }


  }, [game, showTop3PoliciesNotClaim])





  function showVoteCards(){
    const jaVote = thisPlayer.vote === Vote.JA
    const neinVote = thisPlayer.vote === Vote.NEIN
    return (
      <>
        <Box sx={{width: '100%', maxWidth: boardDimensions.x/4, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img onClick={()=> handleVote(Vote.JA)} src={jaPng} draggable='false' style={{width: '100%', border: jaVote ? '12px solid lightgreen' : 'none', borderRadius: '10px', cursor: 'pointer' }}/>
        </Box>
        <Box sx={{width: '100%', display: 'flex', maxWidth: boardDimensions.x/4, justifyContent: 'center', alignItems: 'center'}}>
          <img onClick={()=> handleVote(Vote.NEIN)} src={neinPng} draggable='false' style={{width: '100%',  border: neinVote ? '12px solid lightgreen' : 'none', borderRadius: '10px', cursor: 'pointer' }}/>
        </Box>
      </>
    )
  }


  function showPresPolicies(){
    return game.presCards.map(card => {
      const policyImg = getPolicyImg(card)
      return (
        <Box sx={{width: '100%', maxWidth: boardDimensions.x/5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img key={Math.random()} data-key={card.color} onClick={handlePresDiscard} src={policyImg} draggable='false' style={{width: '100%', borderRadius: '10px', cursor: 'pointer' }}/>
        </Box>
      )
    })
  }
  function showChanPolicies(){
    const chanCards = game.chanCards.map(card => {
      const policyImg = getPolicyImg(card)
      return (
        <Box sx={{width: '100%', maxWidth: boardDimensions.x/5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img key={Math.random()} data-key={card.color} onClick={handleChanPlay} src={policyImg} draggable='false' style={{width: '100%', borderRadius: '10px', cursor: 'pointer' }}/>
        </Box>
      )
    })
    return (
        <>
      {chanCards}
      {/* {inVetoZone && game.status !== Status.VETO_DECLINED && (
      <Box sx={{width: '100%', maxWidth: boardDimensions.x/5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button variant='contained' sx={{width: '100%', maxWidth: boardDimensions.x/5, borderRadius: '6px', lineHeight: '16px', fontSize: {xs: '1em', md: '14px'} }} onClick={handleVetoRequest}>Request Veto</Button>
       </Box>
    )} */}
      </>
    )
  }

  function showPresClaims(){
    return (
    <Box onClick={handlePresClaim} sx={{display: 'flex', flexDirection: 'column', width: '80%', maxWidth: 250, gap: {xs: 1, sm: .5, md: 2}}}>
      <Button variant='contained' data-key={PRES3.RRR} color='error' sx={{fontSize: {xs: '1em', md: '14px'}}}>3 Fascist policies</Button>
      <Button variant='contained' data-key={PRES3.RRB} color='inherit' sx={{lineHeight: {sm: '12px', md: '16px'}, fontSize: {xs: '1em', md: '14px'}}}>2 Fascist and a Liberal policy</Button>
      <Button variant='contained' data-key={PRES3.RBB} sx={{'&:hover': {backgroundColor: '#6fbbea'},lineHeight: {sm: '12px', md: '16px'}, backgroundColor: 'lightskyblue', fontSize: {xs: '1em', md: '14px'}}}>2 Liberal and a Fascist policy</Button>
      <Button variant='contained' data-key={PRES3.BBB} color='primary' sx={{fontSize: {xs: '1em', md: '14px'}}}>3 Liberal policies</Button>
    </Box>
    )
  }

  function showChanClaims(){
    return (
    <Box onClick={handleChanClaim} sx={{display: 'flex', flexDirection: 'column', width: '80%', maxWidth: 250, gap: {xs: 1, md: 2}}}>
      <Button variant='contained' data-key={CHAN2.RR} color='error' sx={{fontSize: {xs: '1em', md: '14px'}}}>2 Fascist policies</Button>
      <Button variant='contained' data-key={CHAN2.RB} color='inherit' sx={{lineHeight: {sm: '12px', md: '16px'}, fontSize: {xs: '1em', md: '14px'}}}>A Fascist and a Liberal policy</Button>
      <Button variant='contained' data-key={CHAN2.BB} color='primary' sx={{fontSize: {xs: '1em', md: '14px'}}}>2 Liberal policies</Button>
    </Box>
    )
  }

  function showInvClaims(){
    return (
    <Box onClick={handleInvClaim} sx={{display: 'flex', flexDirection: 'column', width: '80%', maxWidth: 250, gap: {xs: 1, md: 2}}}>
      <Button variant='contained' data-key={Team.LIB} color='primary' sx={{fontSize: {xs: '1em', md: '14px'}}}>Liberal</Button>
      <Button variant='contained' data-key={Team.FASC} color='error' sx={{fontSize: {xs: '1em', md: '14px'}}}>Fascist</Button>
    </Box>
    )
  }

  function showInspect3PoliciesAndClaims(){
    const top3 = game.top3.map(card => {
      const policyImg = getPolicyImg(card)
      return (
        <Box sx={{width: '100%', maxWidth: boardDimensions.x/5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img key={Math.random()} src={policyImg} draggable='false' style={{width: '100%', borderRadius: '10px'}}/>
        </Box>
      )
    })
    return (
      showTop3PoliciesNotClaim ? top3 :
      <>
        <Box onClick={handleInspect3Claim} sx={{display: 'flex', flexDirection: 'column', width: '80%', maxWidth: 250, gap: {xs: 1, sm: .5, md: 2}}}>
          <Button variant='contained' data-key={PRES3.RRR} color='error' sx={{fontSize: {xs: '1em', md: '14px'}}}>3 Fascist policies</Button>
          <Button variant='contained' data-key={PRES3.RRB} color='inherit' sx={{lineHeight: {sm: '12px', md: '16px'}, fontSize: {xs: '1em', md: '14px'}}}>2 Fascist and a Liberal policy</Button>
          <Button variant='contained' data-key={PRES3.RBB} sx={{'&:hover': {backgroundColor: '#6fbbea'}, lineHeight: {sm: '12px', md: '16px'}, fontSize: {xs: '1em', md: '14px'}, backgroundColor: 'lightskyblue'}}>2 Liberal and a Fascist policy</Button>
          <Button variant='contained' data-key={PRES3.BBB} color='primary' sx={{fontSize: {xs: '1em', md: '14px'}}}>3 Liberal policies</Button>
        </Box>
      </>

    )
  }

  function showVetoOptions(){
    return (
    <Box onClick={handleVetoReply} sx={{display: 'flex', flexDirection: 'column', width: '80%', maxWidth: 250, gap: {xs: 1, md: 2}}}>
      <Button variant='contained' data-key={true} color='primary' sx={{fontSize: {xs: '1em', md: '14px'}}}>Accept</Button>
      <Button variant='contained' data-key={false} color='error' sx={{fontSize: {xs: '1em', md: '14px'}}}>Decline</Button>
    </Box>
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
    //setShowTop3PoliciesNotClaim(true) only one inspect top 3 so don't need to set it back
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
//maxWidth: 600
//{xs: '23px', sm: '25px', md: '30px'}
//fontSize: `calc(${playersDimensions.x}px / ${8*n})

  return (
    <Box sx={{}}>
      <Box sx={{position: 'absolute', width: '100%', height: '100%', top: '50%', left: centerContent ? '50%' : '-50%', transform: 'translate(-50%, -50%)', transition: centerContent ? 'left .75s' : '', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', gap: {xs: 1, sm: 1, md: 3} }}>
        <Typography sx={{fontSize: `calc(${boardDimensions.x}px / 18)`, width: '90%', textAlign: 'center', justifyContent: 'center', display: 'flex', fontWeight: 'bold'}}>{actionTitle}</Typography>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center', gap: {xs: 1, md: 2}, fontSize: `calc(${boardDimensions.x}px / 36)`, width: '100%'}}>
          <Box sx={{display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', width: '60%'}}>
            {actionContent}
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            {inVetoZone && isCurrentChan && game.status === Status.CHAN_PLAY && <Button variant='contained' sx={{fontSize: {xs: '1em', md: '14px'} }} onClick={handleVetoRequest}>Request Veto</Button>}
            {showDefaultOption && <Button variant='contained' style={{backgroundColor: 'orange'}} sx={{fontSize: {sm: '1em', md: '14px'}}} onClick={handleDefaultAction}>Default to Role</Button>}
            {showTop3PoliciesNotClaim && isCurrentPres && game.status === Status.INSPECT_TOP3 && <Button variant='contained' color='secondary' sx={{fontSize: {xs: '1em', md: '14px'}}} onClick={() => setShowTop3PoliciesNotClaim(false)}>Make Claim</Button> }
          </Box>
        </Box>
      </Box>
      <DefaulDiscardDialog game={game} name={name} showDiscardDialog={showDiscardDialog} setShowDiscardDialog={setShowDiscardDialog} presDiscard={game.presDiscard}/>
    </Box>
  )
}

