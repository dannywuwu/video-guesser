import React from "react";
import { Card } from "antd";
import "../styles/ant-components.css";

const UserCard = (props) => {
  const { name, points, guess } = props;

  // Meta component for card
  const { Meta } = Card;
  return (
    <Card title={`${guess}`} hoverable>
      <Meta title={name} description={`Points: ${points}`} />
    </Card>
  );
};

export default UserCard;
