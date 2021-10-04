import React from "react";
import { Card } from "antd";
import "../styles/ant-components.css";

const toggleSelect = () => {
  console.log("selected");
};

const UserCard = (props) => {
  const { name, points, guess } = props;

  // Meta component for card
  const { Meta } = Card;
  return (
    <Card title={`${guess}`} hoverable onClick={() => toggleSelect}>
      <Meta title={name} description={`Points: ${points}`} />
    </Card>
  );
};

export default UserCard;
