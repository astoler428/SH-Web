import React, {useRef, useState, useEffect} from 'react'
import { Box, Paper, TextField, Typography, List, ListItem, Button } from '@mui/material'
import { Team, Status, LogType, Role, Policy, GameType } from '../consts';
import { socket } from '../socket'
import StatusMessage from './StatusMessage';

export default function LogChat({game, name, boardDimensions}) {

  const [message, setMessage] = useState("")
  // const [isFocused, setIsFocused] = useState(false)
  const scrollRef = useRef(undefined);
  const messageInputRef = useRef(undefined);
  window.addEventListener('keydown', handleKeyPress)

  const disabled = ((game.currentPres === name || game.currentChan === name) && (game.status === Status.PRES_DISCARD || game.status === Status.CHAN_PLAY)) || game.status === Status.LIB_SPY_GUESS
  const thisPlayer = game.players.find(player => player.name === name)

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
    if (messageInputRef?.current !== document.activeElement && e.key !== "Enter" && e.key.length === 1 && !e.getModifierState('Control') && !e.getModifierState('Meta') && !e.getModifierState('Alt')) {
      messageInputRef?.current?.focus()
    }
  }

  function renderPolicies(policyStr){
    return policyStr.split('').map((char, idx) => <span key={idx} style={{fontWeight: 700, color: char === 'R' ? 'orangered' : 'deepskyblue'}}>{char}</span>)
  }

  function renderName(name){
    const thisPlayer = game.players.find(player => player.name === name)
    const playerNum = game.players.indexOf(thisPlayer)+1
    return <span style={{fontWeight: 700, color: thisPlayer.color}}>{name} &#123;{playerNum}&#125;</span>
  }

  function renderRole(role, plural = false){
    return <span style={{fontWeight: 700, color: role === Role.HITLER ? 'darkred' : role === Role.FASC ? 'orangered' : 'deepskyblue'}}>{role}{plural ? 's' : ''}</span>
  }

  function renderDate(date){
    return <span style={{fontSize: '.65em', fontFamily: 'inter', color: '#a7a7a8', fontWeight: 700, marginRight: '2px'}}>{date}</span>
  }

  const presidentStr = <span style={{color: 'gold', fontWeight: 800}}>President</span>
  const chancellorStr = <span style={{color: 'gold', fontWeight: 800}}>Chancellor</span>
  const claimsStr = <span style={{color: 'gold', fontWeight: 800}}>claims</span>
  const liberalStr = renderRole(Role.LIB)
  const liberalsStr = renderRole(Role.LIB, true)
  const fascistStr = renderRole(Role.FASC)
  const fascistsStr = renderRole(Role.FASC, true)
  const hitlerStr = renderRole(Role.HITLER)
  const liberalSpyStr = renderRole(Role.LIB_SPY)

  let log = game.log
  if(thisPlayer.team === Team.LIB || thisPlayer.role === Role.HITLER){
    log = log.filter(entry => entry.type !== LogType.HITLER_SEAT)
  }
  if(thisPlayer.team === Team.LIB || (game.players.length < 7 && thisPlayer.role !== Role.HITLER) || (thisPlayer.role === Role.HITLER && !game.settings.hitlerKnowsFasc) ){
    log = log.filter(entry => entry.type !== LogType.OTHER_FASCIST_SEATS)
  }

  log = log.map((entry, i) => {
    const dateStr = renderDate(entry.date)

    if(!entry.type){
      return(
       <ListItem key={i} sx={{margin: '0', padding: '0', marginLeft: '5px'}}>
        <Typography sx={{marginLeft: '0px', fontFamily: "inter", fontWeight: 800, color: 'black', fontSize: '1em'}}>{dateStr}{renderName(entry.name)}: {entry.message}</Typography>
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
        logEntry = <span>Deck shuffled: 6 {liberalStr} and 11 {fascistStr} policies.</span>
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
      case LogType.INDIVIDUAL_SEAT:
        const rolePhrase = game.settings.type === GameType.BLIND ? <span>a hidden</span> : <span>the {renderRole(thisPlayer.role)}</span>
        const seatNum = game.players.indexOf(thisPlayer) + 1
        logEntry = <span>You receive {rolePhrase} role and take seat <span style={{color: 'black', fontWeight: 700}}>#{seatNum}.</span> </span>
        break
      case LogType.HITLER_SEAT:
        const hitlerPlayer = game.players.find(player => player.role === Role.HITLER)
        logEntry = <span>You see that {hitlerStr} is {renderName(hitlerPlayer.name)} </span>
        break
      case LogType.OTHER_FASCIST_SEATS:
        const otherFasc = game.players.filter(player => player.team === Team.FASC && player.role !== Role.HITLER && player.name !== thisPlayer.name)
        if(game.players.length >= 9 && thisPlayer.role === Role.HITLER){
          logEntry = <span>You see that the other {fascistsStr} are {renderName(otherFasc[0].name)}, {renderName(otherFasc[1].name)} and  {renderName(otherFasc[2].name)}. </span>
        }
        else if(game.players.length >= 9 || (game.players.length >= 7 && thisPlayer.role === Role.HITLER)){
          logEntry = <span>You see that the other {fascistsStr} are {renderName(otherFasc[0].name)} and {renderName(otherFasc[1].name)}. </span>
        }
        else{
          logEntry = <span>You see that the other {fascistStr} is {renderName(otherFasc[0].name)}. </span>
        }
        break
      case LogType.CHOOSE_CHAN:
        logEntry = <span>{pres} nominates {chan} as chancellor.</span>
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
        logEntry = <span>{presidentStr} {pres} investigates {investigatee}.</span>
        break
      case LogType.INV_CLAIM:
        logEntry = <span>{presidentStr} {pres} {claimsStr} {investigatee} is {renderRole(claim)}.</span>
        break
      case LogType.SE:
        const seName = renderName(entry.payload.seName)
        logEntry = <span>{presidentStr} {pres} special elects {seName}.</span>
        break
      case LogType.INSPECT_TOP3:
        logEntry = <span>{presidentStr} {pres} looks at the top 3 policies.</span>
        break
      case LogType.INSPECT_TOP3_CLAIM:
        logEntry = <span>{presidentStr} {pres} claims the top 3 policies are {renderPolicies(claim)}. The 3 policies are shuffled and then returned to the top of the deck.</span>
        break
      case LogType.GUN:
        const shotName = renderName(entry.payload.shotName)
        logEntry = <span>{presidentStr} {pres} shoots {shotName}.</span>
        break
      case LogType.VETO_REQUEST:
        logEntry = <span>{chancellorStr} {chan} requests a veto.</span>
        break
      case LogType.VETO_REPLY:
        const vetoAccepted = entry.payload.vetoAccepted
        logEntry = vetoAccepted ? <span>{presidentStr} {pres} accepts veto. The election tracker moves forward.</span>
        : <span>{presidentStr} {pres} declines veto.</span>
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
      case LogType.LIB_SPY_GUESS:
        const spyName = renderName(entry.payload.spyName)
        logEntry = <span>{hitlerStr} guesses {spyName} to be the liberal spy.</span>
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
        logEntry = <span>The {liberalSpyStr} failed to play a {B} policy.</span>
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
        <Typography sx={{marginLeft: '0px', color: '#a7a7a8', fontFamily: "inter", fontWeight: 500, fontSize: '.93em'}}>{dateStr}{logEntry}</Typography>
      </ListItem>
      )
  })

  return (
    <>
    <Box sx={{position: 'relative', width: {xs: '100vw', sm: '50vw'}, flex: 1, minHeight: {xs: '180px', sm: `${boardDimensions.y}px`}, display: 'flex', flexDirection: 'column', margin: 0, padding: 0}}>
      <StatusMessage game={game} name={name}/>
      <Paper elevation={0} sx={{width:'100%', border: '1px solid black', fontSize: {xs: '12px', md: '16px'}, borderRadius: '0', overflow: 'auto', bgcolor: 'white', minHeight: {xs: 'calc(175px - 30px)'}, maxHeight: {xs: `calc(80vh - ${boardDimensions.y}px - 30px - 30px)`, sm: `${boardDimensions.y}px`}, height: {xs: `calc(80vh - ${boardDimensions.y}px - 30px - 30px)`, sm: `${boardDimensions.y}px`}, paddingBottom: '45px'}}>
          {log}
          <ListItem sx={{height: '0', padding: '0', margin: '0'}} ref={scrollRef}></ListItem>
    <form sx={{height: 0,position: 'absolute', bottom: -1}}>
      <button style={{visibility: 'hidden', width: '0px', height: '0px', position: 'absolute', bottom: 0}} type='submit' onClick={sendMessage}></button>
        <TextField
          // onFocus={() => setIsFocused(true)}
          // onBlur={() => setIsFocused(false)}
          inputRef={messageInputRef}
          disabled={disabled}
          value={message}
          size='small'
          autoComplete='off'
          placeholder={!disabled ? 'Send a message' : game.status === Status.LIB_SPY_GUESS ? 'Chat disabled during guess' : 'Chat disabled during government' }
          // color='secondary'
          // inputProps={{style: {color: 'white', borderRadius: '3px', outline: isFocused ? 'none' : '2px solid gray'}}}
          sx={{width: '100%', borderRadius: '3px', bgcolor: 'white', position: 'absolute', bottom: 0}}
          onChange={(e) => setMessage(e.target.value)}
          />
          </form>
      </Paper>
    </Box>
          </>
  )
}