import React from "react";
import UserCard from "./UserCard";

import { Col, Row, Button } from "antd";

const UserList = (props) => {
  const { users, phase, submitSelected, chooser } = props;

  // user.id -> selected status (bool)
  const selectedUsers = {};

  // mutates selectedUsers, !bool
  const handleClick = (user) => {
    // negate if exist, else set true
    if (selectedUsers[user.id]) {
      selectedUsers[user.id] = !selectedUsers[user.id];
    } else {
      selectedUsers[user.id] = true;
    }
  };
  return (
    <>
      <div>
        <Row justify="center" gutter={[20, 16]}>
          {users.map((user) => {
            return (
              <Col key={user.id} span={6}>
                <UserCard
                  isChooser={chooser.id === user.id}
                  key={user.id}
                  name={user.name}
                  points={user.points}
                  guess={user.guess}
                  onClick={() => handleClick(user)}
                />
              </Col>
            );
          })}
        </Row>
      </div>
      {phase === "score" && (
        <Button type="primary" onClick={submitSelected}>
          Submit
        </Button>
      )}
    </>
  );
};

export default UserList;
