import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../Home.js";

const login = () => {
  render(<Home></Home>);
  const nameInput = screen.getByPlaceholderText("Display name");
  const roomInput = screen.getByPlaceholderText("Room name");
  const loginButton = screen.getByRole("button", { name: /Play!/i });
  // login
  fireEvent.change(nameInput, { target: { value: "danny" } });
  fireEvent.change(roomInput, { target: { value: "room1" } });
  fireEvent.click(loginButton);
};

describe("ui", () => {
  it("login", () => {
    login();
  });
});
