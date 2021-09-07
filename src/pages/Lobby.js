import React, { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useUser } from "../context/UserProvider"
import { useSocket } from "../context/SocketProvider"
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
} from "antd"
import "antd/dist/antd.css"
import { Typography } from 'antd';

const { Title, Text } = Typography;

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
  const socket = useSocket()
  const { user, setUser } = useUser()
  const [users, setUsers] = useState([user.id])
  const [readyUsers, setReadyUsers] = useState([])
  const [isReady, setIsReady] = useState(false)

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
    socket.on("get-ready-players", readyUsers => {
      console.log(readyUsers)
      setReadyUsers(readyUsers)
    })
  }, [readyUsers])

  useEffect(() => {
    socket.emit("join-room", user.name, user.room, (user) => {
      console.log(user.name + " has joined room " + user.room)
    })
    return () => {
      socket.emit("leave-room", user.room, (users) => {
        console.log(socket.id, " unmounted ", users)
      })
    }
  }, [])

  return (
    <div>
      <Title level={3}>{user.room}</Title>
      <Row justify="center">
        {
          users.map((user, index) => {
            let type;
            if (readyUsers.some(v => v.id === user.id)) {type = "success"}
            else {type = "default"}
            console.log(type)
            return (
              <Col span={2} flex="auto" className="gutter-row">

                <Text type={type}>{user.name} </Text>

              </Col>
            )
          })}
      </Row>
      {isReady ? <Button onClick={() => setIsReady(prev => !prev)}> Unready </Button > : <Button onClick={() => setIsReady(prev => !prev)}> Ready! </Button>}

    </div>
  )
}

export default Lobby
