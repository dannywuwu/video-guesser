import React from "react";
import { Card } from "antd";

const UserCard = (props) => {
  const { name, points } = props;
  return (
    <Card bordered={false}>
      <Meta title={name} description={`Points: ${points}`} />
    </Card>
  );
};

export default UserCard;
