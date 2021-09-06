import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from "../context/UserProvider.js";
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
} from "antd";
import "antd/dist/antd.css";

const { Meta } = Card;

const classes = {
  gridStyle: {
    width: "50%",
    height: "auto",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

const Lobby = () => {
  const { room } = useUser().room;
  const { name } = useUser().name;

  const [users, setUsers] = useState([name]);
  const [id, setId] = useState();
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [query, setQuery] = useState({});

  const [isChooser, setIsChooser] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configVisible, setConfigVisible] = useState(true);

  const handleFinish = (values) => {
    console.log(values.search);
    setSearch(values.search);
  };
  const handleFinishFailed = (e) => {
    console.log("Finished Failed");
  };

  // useEffect(() => {
  //   socket.on("display-users", users => {
  //     console.log(users)
  //   })
  // }, [users])

  // useEffect(() => {
  //   socket.on("display-users", (payload) => {
  //     console.log("Users: " + payload)
  //     // setUsers(prev => [...prev, ...users])
  //   })
  // }, [users])

  useEffect(() => {
    if (search != "") {
      fetch(`https://song-searcher-backend-thing.weelam.repl.co/get/${search}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setQuery(data);
          setSubmitted(true);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <div>
      {/* {users} */}
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
            <Row justify="center">
              {submitted &&
                query.items.map((item, index) => {
                  return (
                    <Col span={12} flex="auto" className="gutter-row">
                      <div>
                        <Card
                          key={index}
                          hover="true"
                          title={item.title}
                          style={classes.gridStyle}
                          cover={
                            <img
                              alt="example"
                              src={item.url}
                              style={{ height: "100%" }}
                            />
                          }
                        >
                          <Meta
                            avatar={
                              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            }
                            title={item.channelTitle}
                          />
                        </Card>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </>
        )
      }
    </div>
  );
};

export default Lobby;
