import React from "react";
import UserCard from "./UserCard";

import { Col, Row } from "antd";

const UserList = (props) => {
  const { users } = props;
  return (
    <div className="site-card-wrapper">
      <Row gutter={12}>
        {users.map((user) => {
          return (
            <Col span={4}>
              <UserCard
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
  );
};

export default UserList;
