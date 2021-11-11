import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import { useSocket } from "../context/SocketProvider";
import userFactory from "../hooks/userFactory";
// ant design
import "../styles/antd.css";
import { Button, Typography, Form, Input, Row, Col } from "antd";

const { Title } = Typography;

const Home = () => {
  const history = useHistory();

  const [isJoin, setIsJoin] = useState(false); // joining or creating?

  // value is value of form
  const onFinish = (value) => {
    const { user } = value;
    const { name, room } = user;
    // redirect to existing Game page if room already exists
    // TODO check if join and redirect
    if (isJoin) console.log("TODO: Redirect if room exists");
    else {
      // create new lobby
      history.push(`/lobby/${room}`);
    }
  };

  return (
    // TODO: Add header(set theme) and footer(github repo)
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
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
          <Title
            style={{ textAlign: "center", marginBottom: "15px" }}
            level={2}
          >
            Game Title
          </Title>
          <Form.Item
            name={["user", "name"]}
            rules={[
              { required: true, message: "Please input your display name!" },
            ]}
            noStyle={true}
          >
            <Input
              size="large"
              placeholder="Display name"
              style={{ margin: "10px 0px" }}
            />
          </Form.Item>

          <Form.Item
            name={["user", "room"]}
            rules={[{ required: true, message: "Please input the room name!" }]}
            noStyle={true}
          >
            <Input
              size="large"
              placeholder="Room name"
              style={{ margin: "10px 0px" }}
            />
          </Form.Item>

          <Form.Item noStyle={true}>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              style={{ margin: "10px 0px" }}
            >
              Play!
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Home;
