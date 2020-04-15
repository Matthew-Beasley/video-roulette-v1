import React, { useState, useEffect } from "react";

const TextChat = ({ message, sendMessage, messageHistory }) => {
  const [msgHistory, setMsgHistory] = useState([])

  useEffect(() => {
    console.log(messageHistory)
    setMsgHistory([...messageHistory]);
  }, [messageHistory.length]);

  return (
    <div id="textchat-display">
      <div id="maessage-box">
        <ul id="text messages">
          {msgHistory.map((idx, msg) => {
            return (
              <li key={idx}>{msg}</li>
            )
          })}
        </ul>
      </div>
      <form onSubmit={(ev) => sendMessage(ev, message)}>
        <input
          type="text"
          placeholder="Input your text here"
          id="msgTxt"
          onChange={(ev) => { message = ev.target.value }} //create form component sovideo isn't interupted by rerender
        />
      </form>
    </div>
  )
}

export default TextChat;
