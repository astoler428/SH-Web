import React, {useState, useRef, useEffect} from 'react'
import { socket } from '../socket'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText } from '@mui/material'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import {Status} from '../consts'

export default function Chat({game, name}) {
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(true)
  const [chatLength, setChatLength] = useState(0)
  const messageInputRef = useRef(undefined);
  const scrollRef = useRef(undefined);
  window.addEventListener('keydown', handleKeyPress)

  const disabled = (game.currentPres === name || game.currentChan === name) && (game.status === Status.PRES_DISCARD || game.status === Status.CHAN_PLAY)
  const unReadChatMessages = game.chat.length > chatLength
  useEffect(() => {
    messageInputRef.current.blur();
  }, []);

  function sendMessage(){
    if(message){
      socket.emit('chat', {id: game.id, name, message})
      setMessage("")
    }
  }

  useEffect(() => {
    if(unReadChatMessages && open){
      setChatLength(game.chat.length)
    }
  }, [game, open])

  function toggleChatWindow(e){
    setOpen(prevOpen => !prevOpen)
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && message && document.activeElement === messageInputRef.current) {
      sendMessage()
    }
    else if (e.key !== "Enter" && e.key.length === 1 && document.activeElement !== messageInputRef.current) {
      setOpen(true)
      messageInputRef.current?.focus()
    }
  }

  const gameChat = game.chat.map(message => {
    return (
      <ListItem key={Math.random()} sx={{margin: '0', padding: '0', marginLeft: '5px'}}>
        <Typography sx={{marginLeft: '5px', fontFamily: "ShoppingBasketJNL", fontSize: {xs: '12px', sm: '16px'}}}><span style={{fontWeight: 'bold'}}>{message.name}: </span>{message.message}</Typography>
      </ListItem>
    )
  })

  useEffect(() => {
    if(open){
      scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }
  }, [game])

  return (
    <Box sx={{position: 'fixed', zIndex: 100, bottom: open ? '-0px' : {xs: '-262px', sm: '-386px'}, right: 0, width: '90%', maxWidth: '360px', margin: 0, padding: 0}}>
      <Box sx={{display: 'flex', alignItems: 'center', backgroundColor: 'black', height: '30px', color: 'white', width:'100%', maxHeight: '400px', borderRadius: '4px 4px 0 0', position: 'relative'}}>
        <Box onClick={toggleChatWindow} sx={{display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'space-between', margin: '0 5px'}}>
        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
          {unReadChatMessages ? <MarkChatUnreadIcon fontSize='small'/> :
          <ChatBubbleIcon fontSize='small'/>}
          <Typography>Chat</Typography>
        </Box>
        <IconButton sx={{}}>
            <MinimizeIcon sx={{backgroundColor: 'lightgray', fontSize: 'large', borderRadius: '30px'}}/>
          </IconButton>
        </Box>
      </Box>
      <Paper elevation={1} sx={{width:'100%', height: {xs: '222px', sm: '346px'}, maxHeight: '400px', overflow: 'auto', borderRadius: '0', bgcolor: 'white', paddingBottom: '40px'}}>
        <List>
          {gameChat}
          <ListItem sx={{height: '0', padding: '0', margin: '0'}} ref={scrollRef}></ListItem>
        </List>
        <TextField
          disabled={disabled}
          inputRef={messageInputRef}
          value={message}
          size='small'
          autoComplete='off'
          placeholder={disabled ? 'Chat disabled during government' : 'Send a message'}
          sx={{width: '100%', borderRadius: '0', backgroundColor: 'white', position: 'absolute', bottom: 0}}
          onChange={(e) => setMessage(e.target.value)}
          />
      </Paper>
    </Box>
  )
}
