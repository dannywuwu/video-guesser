import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { useSocket } from "../context/SocketProvider";
import Countdown from "react-countdown";
import { Button, Card, Row, Col, Typography } from "antd";
import { useHistory, Redirect } from "react-router";
import "../styles/antd.css";

const { Title, Text } = Typography;
// const { Header, Footer, Sider, Content } = Layout;

// const { Meta } = Card;

/*
const styles = {
  gridStyle: {
    width: "50%",
    height: "auto",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
};
*/

const Lobby = () => {
  const history = useHistory();

  const socket = useSocket();
  const { user, setUser, allUsers, setAllUsers } = useUser();
  // state
  const [readyUsers, setReadyUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [countDown, setCountDown] = useState(false);

  // listen and render users
  useEffect(() => {
    if (socket) {
      socket.on("display-users", (users) => {
        setAllUsers(users);
      });
      console.log("new users");
    }
  }, [allUsers]);

  // player is ready
  useEffect(() => {
    if (socket) {
      socket.emit("ready-player", isReady);
    }
  }, [isReady]);

  // fetch ready players and render ready
  useEffect(() => {
    if (socket) {
      socket.on("get-ready-players", (user, ready) => {
        if (ready) {
          setReadyUsers((prev) => [...new Set([...prev, user])]);
        } else {
          setReadyUsers((prev) => prev.filter((v) => v.id !== user.id));
        }
      });
      // all players are ready, game start
      if (readyUsers.length === Object.keys(allUsers).length) {
        setCountDown(true);
      } else {
        setCountDown(false);
      }
    }
  }, [readyUsers]);

  // user join/leave
  useEffect(() => {
    if (socket) {
      console.log("joining room as ", user);
      // user joins a room
      socket.emit("join-room", user.name, user.room, (users) => {
        console.log("users in room", users);
      });

      // emits leave-room when user leaves
      return () => {
        socket.emit("leave-room", user.room, (users) => {
          console.log(socket.id, " unmounted ", users);
        });
        // re-render ready users
        setReadyUsers((prev) => prev.filter((v) => v.id !== user.id));
      };
    }
  }, []);

  let readyText;
  if (isReady) {
    readyText = "Unready";
  } else {
    readyText = "Ready!";
  }
  // redirect if socket undefined
  return socket ? (
    <div>
      <Row
        align="middle"
        justify="center"
        style={{ margin: "0 auto", width: "40%", height: "100vh" }}
      >
        <Col xs={24} className="gutter-row">
          <Title
            style={{ textAlign: "center", marginBottom: "40px" }}
            level={3}
          >
            {user.room}
          </Title>
          {Object.keys(allUsers).length !== 0 &&
            Object.keys(allUsers).map((uid, index) => {
              let type;
              let boxShadow;
              if (readyUsers.some((v) => v.id === uid)) {
                type = "success";
                boxShadow = "#ffadd2";
              } else {
                type = "default";
                boxShadow = "";
              }
              return (
                <Card
                  key={index}
                  size="small"
                  type="primary"
                  style={{ marginTop: 0, backgroundColor: `${boxShadow}` }}
                >
                  <Text>{allUsers[uid].name} </Text>
                </Card>
              );
            })}
        </Col>

        {countDown ? (
          <Countdown
            date={Date.now() + 5000}
            onComplete={() => history.push("/game")}
            renderer={({ seconds }) => (
              <Button
                size="large"
                type="primary"
                style={{ marginTop: 16 }}
                onClick={() => setIsReady((prev) => !prev)}
              >
                {seconds}
              </Button>
            )}
          />
        ) : (
          <Button
            size="large"
            type="primary"
            style={{ marginTop: 16 }}
            onClick={() => setIsReady((prev) => !prev)}
          >
            {" "}
            {readyText}{" "}
          </Button>
        )}
      </Row>
      {/* {console.log(allUsers.length, readyUsers.length)} */}
    </div>
  ) : (
    <Redirect to="/" />
  );
};

export default Lobby;
