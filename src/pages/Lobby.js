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


  const [id, setId] = useState()
  const [search, setSearch] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState({})

  const [isChooser, setIsChooser] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)
  const [configVisible, setConfigVisible] = useState(true)

  const handleFinish = (values) => {
    console.log(values.search)
    setSearch(values.search)
  }
  const handleFinishFailed = (e) => {
    console.log("Finished Failed")
  }

 
  useEffect(() => {
    socket.on("display-users", users => {
      setUsers(users)
    })

  }, [users])

  useEffect(() => {
    console.log(socket.id + " mounted")
    socket.emit("join-room", user.name, user.room, (user) => {
      console.log(user)
    })
    return () => {
      socket.emit("leave-room", user.room, (users) => {
        console.log(socket.id," unmounted ", users)
      })
    }
  }, [])

  return (
    <div>
      {
        // allow user to search if it's there turn
        isChooser && (
          <>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              // onFieldsChange={handleFieldsChange}
              autoComplete="off"
            >
              <Form.Item
                name="search"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Search..." />
              </Form.Item>
            </Form>

          </>
        )
      }
      <Row justify="center">
        {
          users.map((user, index) => {
            return (
              <Col span={2} flex="auto" className="gutter-row">
                  {user.name}

              </Col>
            )
          })}
      </Row>
    </div>
  )
}

export default Lobby
