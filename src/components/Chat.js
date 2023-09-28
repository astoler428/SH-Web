import React, {useState, useRef, useEffect} from 'react'
import { socket } from '../socket'


export default function Chat({game, name}) {
  const [message, setMessage] = useState("")
  const gameChat = game.chat.map(message => <div key={Math.random()}>{message.name}: {message.message}</div>)
  const messageInputRef = useRef(null);


  useEffect(() => {
    messageInputRef.current.focus();
  }, [message]);

  useEffect(() => {
    messageInputRef.current.blur();
  }, []);

  function sendMessage(){
    if(message){
      socket.emit('chat', {id: game.id, name, message})
      setMessage("")
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && message) sendMessage();
  }

  return (
    <div>
      <input
        ref={messageInputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
      <div>{gameChat}</div>
    </div>
  )
}
