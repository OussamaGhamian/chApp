import React, { Component } from 'react';
import io from 'socket.io-client';
import Msg from './components/Msg'
import "./App.css"
class App extends Component {

  state = {
    isConnected: false,
    id: null,
    //list of friends
    peeps: [],
    msgs: []
  }
  socket = null

  componentWillMount() {

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({ isConnected: true })
    })
    this.socket.on('pong!', (additionalStuff) => {
      // console.log('server answered!', additionalStuff)
    })

    this.socket.on('youare', (answer) => {
      this.setState({ id: answer.id })
    })
    this.socket.on('peeps', (peeps) => {
      // console.log(peeps);
      this.setState({ peeps })
      // this.state.peeps.map(user => console.log(user))
    })

    this.socket.on("new connection", newConnections => {
      // console.log(newConnections);
      this.setState({ peeps: [...this.state.peeps, newConnections] })
    });

    this.socket.on("new disconnection", newDisconnections => {
      // console.log(newDisconnections);
      this.setState({ peeps: this.state.peeps.filter(user => user === newDisconnections) })
    });

    this.socket.on('next', (message_from_server) => console.log(message_from_server))

    this.socket.on("addition", (message_from_server) => this.setState({ msg: message_from_server }))

    this.socket.on('disconnect', () => {
      this.setState({ isConnected: false })
    })


    /** this will be useful way, way later **/
    this.socket.on('room', (old_messages) => this.setState({ msgs: [...old_messages] }))
    // this.socket.on('room', (old_messages) => { this.setState({ old_messages }) })
    console.log(this.state.msgs)
    this.state.msgs.map(msg => console.log(msg))
    this.state.msgs.map(item => console.log(item))
  }
  componentDidMount() {
    this.socket.emit("addition");
    this.socket.emit("hint:addition");
    this.socket.emit('whoami');
    // this.socket.on('room', old_messages => { this.setState({ oldMsgs: [...old_messages] }) })
  }
  send = (e) => {
    e.preventDefault();
    // console.log(e.target.answer.value)
    this.socket.emit('whoami')
    this.socket.emit("message", {
      "id": this.state.id,
      "name": "OussamaGH",
      "text": e.target.msg.value
    })
    e.target.msg.value = "";
  }
  // componentDidUpdate(){
  //   this.socket.on('room', old_messages => { this.setState({ oldMsgs: [...old_messages] }) })
  // }
  componentWillUnmount() {
    this.socket.close()
    this.socket = null
  }

  render() {
    return (
      <div className="App">
        <div className="status">{this.state.isConnected ? 'Online' : 'Offline'}</div>
        {/* <div>id: {this.state.id}</div> */}
        {/* <button onClick={() => this.socket.emit('ping!')}>ping</button> */}
        {/* <button onClick={() => this.socket.emit('whoami')}>Who am I?</button> */}
        {/* <button onClick={() => this.socket.emit("give me next")}>giveMeNext</button> */}

        {/* <button onClick={() => this.socket.emit("answer")}>answer</button> */}

        {this.state.msgs.map((item, index) => <div className="test"><Msg id={item.id} name={item.name} text={item.text} date={item.date} /></div>)}

        <form onSubmit={this.send} className="form">
          <input className="input" name="msg"></input>
          <button className="btn" type="submit">send</button>
        </form>
      </div>
    );
  }
}

export default App;