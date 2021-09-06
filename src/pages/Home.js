import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { io } from "socket.io-client"
import { useUser } from "../context/UserProvider"
import { useSocket } from "../context/SocketProvider"
import userFactory from "../hooks/userFactory"
// ant design
import "antd/dist/antd.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Button, Space, Typography, Modal, Form, Input } from "antd"
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

  const showCreate = () => {
    setIsModalVisible(true)
    setIsJoin(false)
  }

  const showJoin = () => {
    setIsModalVisible(true)
    setIsJoin(true)
  }

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
    <Space direction="vertical" align="center" style={{ height: "100vh" }}>
      <Title level={2}>Game Title</Title>
      <Button type="primary" shape="round" size="large" onClick={showJoin}>
        {" "}
        Join Game{" "}
      </Button>
      <Button type="primary" shape="round" size="large" onClick={showCreate}>
        {" "}
        Create Game{" "}
      </Button>

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button form="myForm" key="submit" htmlType="submit">
            Submit
          </Button>,
        ]}
      >
        {isJoin ? (
          <Form
            id="myForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={handleFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name={["user", "name"]}
              rules={[
                { required: true, message: "Please input your display name!" },
              ]}
            >
              <Input placeholder="Display name" />
            </Form.Item>
            <Form.Item
              name={["user", "room"]}
              rules={[
                { required: true, message: "Please input the room name!" },
              ]}
            >
              <Input placeholder="Room name" />
            </Form.Item>
          </Form>
        ) : (
          <Form
            id="myForm"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={handleFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name={["user", "name"]}
              rules={[
                { required: true, message: "Please input your display name!" },
              ]}
            >
              <Input placeholder="Display name" />
            </Form.Item>
            <Form.Item
              name={["user", "room"]}
              rules={[
                { required: true, message: "Please input the room name!" },
              ]}
            >
              <Input placeholder="Room name" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Space>
  )
}

export default Home
