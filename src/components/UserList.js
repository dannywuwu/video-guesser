import React from "react";
import UserCard from "./UserCard";

import { Col, Row, Button } from "antd";

const UserList = (props) => {
  const { users, phase, checkChooser, selectWinner } = props;

  // user.id -> selected status (bool)
  const selectedUsers = {};



  return (
    <>
      <div>
        <Row justify="center" gutter={[20, 16]}>
          {users.map((user) => {
            return (
              <Col key={user.id} span={6} onClick={() => selectWinner(user)}>
                <UserCard
                  phase={phase}
                  isChooser={checkChooser(user.id)}
                  key={user.id}
                  name={user.name}
                  points={user.points}
                  guess={user.guess}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
};

export default UserList;
