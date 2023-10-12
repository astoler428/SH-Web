import React, {useState, useRef, useEffect} from 'react'
import { socket } from '../socket'
import {CardHeader, Paper, List, Card, ListItemButton, ListItemIcon, Typography, IconButton, Container, Box, CardContent, TextField, ListItem, ListItemText } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import MinimizeIcon from '@mui/icons-material/Minimize';

export default function Chat({game, name}) {
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(true)
  const messageInputRef = useRef(undefined);
  const scrollRef = useRef(undefined);
  window.addEventListener('keydown', handleKeyPress)

  // useEffect(() => {
  //   messageInputRef.current.focus();
  // }, [message]);

  useEffect(() => {
    messageInputRef.current.blur();
  }, []);

  function sendMessage(){
    if(message){
      socket.emit('chat', {id: game.id, name, message})
      setMessage("")
    }
  }

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
        <Typography sx={{marginLeft: '5px', fontFamily: "ShoppingBasketJNL"}}><span style={{fontWeight: 'bold'}}>{message.name}: </span>{message.message}</Typography>
      </ListItem>
    )
  })

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [game])

  return (
    <Box sx={{position: 'fixed', zIndex: 100, bottom: open ? '0px' : '-390px', right: 0, width: '360px'}}>
      <Box sx={{display: 'flex', alignItems: 'center', backgroundColor: 'black', height: '30px', color: 'white', width:'100%', maxHeight: '400px', borderRadius: '4px 4px 0 0', position: 'relative'}}>
        <Box onClick={toggleChatWindow} sx={{display: 'flex', flexGrow: '1', alignItems: 'center', justifyContent: 'space-between', margin: '0 5px'}}>
        <Typography>Chat</Typography>
        <IconButton sx={{}}>
            <MinimizeIcon sx={{backgroundColor: 'lightgray', fontSize: 'large', borderRadius: '30px'}}/>
          </IconButton>
        </Box>
      </Box>
      <Paper elevation={1} sx={{width:'100%', height: '350px', maxHeight: '400px', overflow: 'auto', position: 'relative', borderRadius: '0', bgcolor: 'white'}}>
        <List>
          {gameChat}
          <ListItem sx={{height: '0', padding: '0', margin: '0'}} ref={scrollRef}></ListItem>
        </List>
      </Paper>
      <TextField
        inputRef={messageInputRef}
        value={message}
        size='small'
        autoComplete='off'
        placeholder='Send a message'
        sx={{width: '100%', borderRadius: '0', backgroundColor: 'white'}}
        onChange={(e) => setMessage(e.target.value)}
        />
    </Box>
  )
}
