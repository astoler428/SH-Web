import React, {useRef, useState, useEffect} from 'react'
import { Box, Paper, TextField, Typography, List, ListItem } from '@mui/material'
import { Team, Status, LogType, Role, Policy } from '../consts';
import { socket } from '../socket'
import StatusMessage from './StatusMessage';


export default function LogChat({game, name, boardDimensions}) {
  const [message, setMessage] = useState("")
  const scrollRef = useRef(undefined);
  const messageInputRef = useRef(undefined);
  window.addEventListener('keydown', handleKeyPress)

  const disabled = (game.currentPres === name || game.currentChan === name) && (game.status === Status.PRES_DISCARD || game.status === Status.CHAN_PLAY)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [game])

  function sendMessage(e){
    e.preventDefault()
    if(message){
      socket.emit('chat', {id: game.id, name, message})
      setMessage("")
    }
  }

  function handleKeyPress(e) {
    if (messageInputRef?.current === document.activeElement && e.key !== "Enter" && e.key.length === 1) {
      messageInputRef?.current?.focus()
    }
  }

  function renderPolicies(policyStr){
    console.log(policyStr)
    return policyStr.split('').map((char, idx) => <span key={idx} style={{color: char === 'R' ? 'red' : 'blue'}}>{char}</span>)
  }

  function renderName(name){
    const thisPlayer = game.players.find(player => player.name === name)
    const playerNum = game.players.indexOf(thisPlayer)+1
    return <span style={{fontSize:'18px'}}>{name} &#123;{playerNum}&#125;</span>
  }

  function renderRole(role, plural = false){
    return <span style={{color: role === Role.HITLER ? 'darkred' : role === Role.FASC ? 'red' : 'blue'}}>{role}{plural ? 's' : ''}</span>
  }

  const presidentStr = <span style={{color: 'gold'}}>President</span>
  const chancellorStr = <span style={{color: 'gold'}}>Chancellor</span>
  const claimsStr = <span style={{color: 'gold'}}>claims</span>
  const liberalStr = renderRole(Role.LIB)
  const liberalsStr = renderRole(Role.LIB, true)
  const fascistStr = renderRole(Role.FASC)
  const fascistsStr = renderRole(Role.FASC, true)
  const hitlerStr = renderRole(Role.HITLER)
  const liberalSpyStr = renderRole(Role.LIB_SPY)

  const log = game.log.map((entry, i) => {

    if(!entry.type){
      return(
       <ListItem key={i} sx={{margin: '0', padding: '0', marginLeft: '5px'}}>
        <Typography sx={{marginLeft: '5px', fontFamily: "ShoppingBasketJNL", fontSize: {xs: '12px', sm: '16px'}}}><span style={{fontWeight: 'bold'}}>{entry.name}: </span>{entry.message}</Typography>
      </ListItem>
      )
    }

    const pres = entry.payload?.pres && renderName(entry.payload.pres)
    const chan = entry.payload?.chan && renderName(entry.payload.chan)
    const investigatee = entry.payload?.investigatee && renderName(entry.payload.investigatee)
    const name = entry.payload?.name && renderName(entry.payload.name)
    const claim = entry.payload?.claim && entry.payload.claim

    let logEntry

    switch (entry.type){
      case LogType.INTRO_DECK:
        logEntry = <span>The deck is shuffled with 6 {liberalStr} and 11 {fascistStr} policies.</span>
        break
      case LogType.INTRO_ROLES:
        logEntry = <span>The roles are dealt with {Math.ceil((game.players.length+1)/2)} {liberalsStr} and {Math.floor((game.players.length-1)/2)} {fascistsStr}.</span>
        break
      case LogType.INTRO_LIB_SPY:
        logEntry = <span>One of the {liberalsStr} is the {liberalSpyStr}.</span>
        break
      case LogType.INTRO_MIXED:
        logEntry = <span>{hitlerStr} is a {fascistStr} but other party membership and roles may be mixed. Your party membership is your team. Your role is the policies you play.</span>
        break
      case LogType.INTRO_HITLER_KNOWS_FASC:
        logEntry = <span>{hitlerStr} knows the other {game.players.length >= 7 ? fascistsStr : fascistStr}.</span>
        break
      case LogType.INTRO_RED_DOWN:
        logEntry = <span>The game begins with a {fascistStr} policy enacted.</span>
        break
      case LogType.CHOOSE_CHAN:
        logEntry = <span> {pres} nominates {chan} as chancellor.</span>
        break
      case LogType.ENACT_POLICY:
        const policy = entry.payload.policy
        logEntry = <span>A {policy === Policy.FASC ? fascistStr : liberalStr} policy is enacted.</span>
        break
      case LogType.CHAN_CLAIM:
        logEntry = <span>{chancellorStr} {chan} {claimsStr} {renderPolicies(entry.payload.claim)}.</span>
        break
      case LogType.PRES_CLAIM:
        logEntry = <span>{presidentStr} {pres} {claimsStr} {renderPolicies(entry.payload.claim)}.</span>
        break
      case LogType.INV:
        logEntry = <span>{pres} investigates {investigatee}.</span>
        break
      case LogType.INV_CLAIM:
        logEntry = <span>{pres} {claimsStr} {investigatee} is {renderRole(claim)}.</span>
        break
      case LogType.SE:
        const seName = renderName(entry.payload.seName)
        logEntry = <span>{pres} special elects {seName}.</span>
        break
      case LogType.INSPECT_TOP3:
        logEntry = <span>{pres} looks at the top 3 policies.</span>
        break
      case LogType.INSPECT_TOP3_CLAIM:
        logEntry = <span>{pres} claims the top 3 policies are {renderPolicies(claim)}.</span>
        break
      case LogType.GUN:
        const shotName = renderName(entry.payload.shotName)
        logEntry = <span>{pres} shoots {shotName}.</span>
        break
      case LogType.VETO_REQUEST:
        logEntry = <span>{chan} requests a veto.</span>
        break
      case LogType.VETO_REPLY:
        const vetoAccepted = entry.payload.vetoAccepted
        logEntry = vetoAccepted ? <span>{pres} accepts veto. The election tracker moves forward.</span>
        : <span>{pres} declines veto.</span>
        break
      case LogType.CONFIRM_FASC:
        logEntry = <span>{name} tried to confirm themself as {fascistStr}, but was {liberalStr}.</span>
        break
      case LogType.ELECTION_FAIL:
        logEntry = <span>The election fails and the election tracker moves forward.</span>
        break
      case LogType.TOP_DECK:
        logEntry = <span>Top decking.</span>
        break
      case LogType.LIB_WIN:
        logEntry = <span>{liberalsStr} win the game.</span>
        break
      case LogType.FASC_WIN:
        logEntry = <span>{fascistsStr} win the game.</span>
        break
      case LogType.LIB_SPY_WIN:
        logEntry = <span>{liberalSpyStr} wins the game.</span>
        break
      case LogType.LIB_SPY_FAIL:
        const B = renderPolicies('B')
        logEntry = <span>{liberalSpyStr} failed to play a {B} policy. {liberalSpyStr} loses.</span>
        break
      case LogType.HITLER_ELECTED:
        logEntry = <span>{hitlerStr} has been elected chancellor.</span>
        break
      case LogType.HITLER_SHOT:
        logEntry = <span>{hitlerStr} has been shot.</span>
        break
      case LogType.DECK:
        const remainingPolicies = renderPolicies(entry.payload.remainingPolicies)
        logEntry = <span>The remaining policies are {remainingPolicies}</span>
        break
    }

    return (
      <ListItem key={i} sx={{margin: '0', padding: '0', marginLeft: '5px'}}>
        <Typography sx={{marginLeft: '5px', fontFamily: "ShoppingBasketJNL", fontSize: {xs: '12px', md: '16px'}}}>{logEntry}</Typography>
      </ListItem>
      )
  })

  return (
    <>
    <Box sx={{position: 'relative', width: {xs: '100vw'}, minHeight: {xs: `calc(80vh - ${boardDimensions.y}px - 30px)`, sm: `${boardDimensions.y}px`}, height: {xs: `calc(80vh - ${boardDimensions.y}px - 30px)`, sm: `${boardDimensions.y}px`}, display: 'flex', flexDirection: 'column', flex: 1, margin: 0, padding: 0}}>
      <StatusMessage game={game} name={name}/>
      <Paper elevation={1} sx={{width:'100%', flex: 1, borderRadius: '0', overflow: 'auto', bgcolor: 'gray', paddingBottom: '45px'}}>
          {log}
          <ListItem sx={{height: '0', padding: '0', margin: '0'}} ref={scrollRef}></ListItem>
    <form >
      <button style={{visibility: 'hidden', width: '0px', height: '0px', position: 'absolute'}} type='submit' onClick={sendMessage}></button>
        <TextField
          inputRef={messageInputRef}
          disabled={disabled}
          value={message}
          size='small'
          autoComplete='off'
          placeholder={disabled ? 'Chat disabled during government' : 'Send a message'}
          sx={{width: '100%', borderRadius: '0', backgroundColor: 'gray', position: 'absolute', bottom: 1}}
          onChange={(e) => setMessage(e.target.value)}
          />
          </form>
      </Paper>
    </Box>
          </>
  )
}