import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useUser } from "../context/UserProvider"
import { useSocket } from "../context/SocketProvider"
import Countdown from "react-countdown";
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Avatar,
  Row,
  Col,
  Box,
  Space,
  Typography,
  Layout
} from "antd"
import { useHistory } from "react-router";
import "../styles/antd.css"

const { Title, Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

const { Meta } = Card

const classes = {
  gridStyle: {
    width: "50%",
    height: "auto",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
}

const Lobby = () => {
  const history = useHistory()

  const socket = useSocket()
  const { user, setUser, users, setUsers } = useUser()
  const [readyUsers, setReadyUsers] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [countDown, setCountDown] = useState(false)

  useEffect(() => {
    socket.on("display-users", users => {
      setUsers(users)
    })

    return () => {
      console.log("unmount set users")
    }
  }, [users])

  useEffect(() => {
    socket.emit("ready-player", isReady)
  }, [isReady])

  useEffect(() => {
    socket.once("get-ready-players", readyUsers => {
      console.log(readyUsers)
      setReadyUsers(readyUsers)
    })
    if (readyUsers.length === users.length && users.length !== 0) { setCountDown(true) }
    else { setCountDown(false) }
  }, [readyUsers])

  useEffect(() => {
    socket.emit("join-room", user.name, user.room, (user) => {
      console.log(user.name + " has joined room " + user.room)
    })
    console.log(users)
    return () => {
      socket.emit("leave-room", user.room, (users) => {
        console.log(socket.id, " unmounted ", users)
      })
    }
    
  }, [])

  let readyText
  if (isReady) { readyText = "Unready" }
  else { readyText = "Ready!" }
  return (
    <div>
      <Row align="middle" justify="center" style={{ margin: "0 auto", width: "40%", height: "100vh" }}>
        <Col xs={24} className="gutter-row">

          <Title style={{ textAlign: "center", marginBottom: "40px" }} level={3}>{user.room}</Title>
          {
            users.map((user, index) => {
              let type;
              let boxShadow;
              if (readyUsers.some(v => v.id === user.id)) { 
                type = "success" 
                boxShadow = "#ffadd2"
              }
              else { 
                type = "default" 
                boxShadow = ""
              }
              console.log(type)
              return (
                <Card size="small" type="primary" style={{ marginTop: 0, backgroundColor: `${boxShadow}`}}>
                  <Text >{user.name} </Text>
                </Card>

              )
            })}
        </Col>

        {countDown ?
          <Countdown
            date={Date.now() + 5000}
            onComplete={() => history.push("/game")}
            renderer={({ seconds }) => <Button size="large" type="primary" style={{ marginTop: 16 }} onClick={() => setIsReady(prev => !prev)}>{seconds}</Button>}
          />
          :
          <Button size="large" type="primary" style={{ marginTop: 16 }} onClick={() => setIsReady(prev => !prev)}> {readyText} </Button >
        }

      </Row>
      {console.log(users.length, readyUsers.length)}
    </div>
  )
}

export default Lobby
