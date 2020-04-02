import React from 'react'
import './Msg.css'
export default function Msg(props) {
  return (
    <div className="msg">
      <p className="userName">{props.name}</p>
      <div className="line">
        <p className="text">{props.text}</p><span className="time">{props.date}</span>
      </div>
    </div>
  )
}
