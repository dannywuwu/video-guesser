import React from "react";
import UserCard from "./UserCard";

import { Col, Row } from "antd";

const UserList = (props) => {
  const { users } = props;
  return (
    <div className="site-card-wrapper">
      <Row gutter={12}>
        {users.map((user) => {
          <Col span={4}>
            <UserCard key={user.id} name={user.name} points={points} />;
          </Col>;
        })}
      </Row>
    </div>
  );
};

export default UserList;
