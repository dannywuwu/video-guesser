import React, { useState, useEffect } from "react"
import { useHistory, Redirect } from "react-router-dom"
import { io } from "socket.io-client"
import { useUser } from "../context/UserProvider"
import { useSocket } from "../context/SocketProvider"
import userFactory from "../hooks/userFactory"
// ant design
import "../styles/antd.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Button, Space, Typography, Modal, Form, Input, Row, Col } from "antd"
import { formatCountdown } from "antd/lib/statistic/utils"

const { Title } = Typography

const Home = () => {
  const history = useHistory()
  const socket = useSocket()
  const { user, setUser } = useUser()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isJoin, setIsJoin] = useState(false) // joining or creating?

  useEffect(() => {
    // console.log(user, socket.id)
  }, [])

  const onFinish = (value) => {
    setIsModalVisible(false)
    // redirect to Game page
    if (isJoin) console.log("these nuts")
    else {
      setUser(userFactory(socket.id, value.user.name, value.user.room))
      history.push("/lobby")
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    // TODO: Add header(set theme) and footer(github repo)
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}> 
      <Col xs={8} md={4}>
        <Form
          id="myForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={handleFinishFailed}
          autoComplete="off"
        >
          <Title style={{ textAlign: "center", marginBottom: "15px" }} level={2}>Game Title</Title>
          <Form.Item
            name={["user", "name"]}
            rules={[
              { required: true, message: "Please input your display name!" },
            ]}
            noStyle={true}

          >
            <Input size="large" placeholder="Display name" style={{ margin: "10px 0px" }} />
          </Form.Item>

          <Form.Item
            name={["user", "room"]}
            rules={[
              { required: true, message: "Please input the room name!" },
            ]}
            noStyle={true}
          >
            <Input size="large" placeholder="Room name" style={{ margin: "10px 0px" }} />
          </Form.Item>

          <Form.Item noStyle={true}>
            <Button block size="large" type="primary" htmlType="submit" style={{ margin: "10px 0px"}}>
              Play!
            </Button>
          </Form.Item>


        </Form>
      </Col>
    </Row>
  )
}

export default Home
