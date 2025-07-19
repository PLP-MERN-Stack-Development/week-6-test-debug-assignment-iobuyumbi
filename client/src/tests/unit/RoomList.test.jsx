// client/src/tests/unit/RoomList.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomList from "../../components/RoomList";

// Mock the UI components
jest.mock("../../components/ui/card", () => ({
  Card: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
}));

jest.mock("../../components/ui/button", () => ({
  Button: ({ children, onClick, disabled, variant, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variant} ${className}`}
    >
      {children}
    </button>
  ),
}));

jest.mock("../../components/ui/input", () => ({
  Input: ({ placeholder, value, onChange, className }) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  ),
}));

describe("RoomList Component", () => {
  const mockRooms = ["general", "random", "help"];
  const mockOnSelectRoom = jest.fn();
  const mockOnCreateRoom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders room list with provided rooms", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    expect(screen.getByText("Chat Rooms:")).toBeInTheDocument();
    expect(screen.getByText("general")).toBeInTheDocument();
    expect(screen.getByText("random")).toBeInTheDocument();
    expect(screen.getByText("help")).toBeInTheDocument();
  });

  it("highlights current room with secondary variant", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const currentRoomButton = screen.getByText("general");
    const otherRoomButton = screen.getByText("random");

    expect(currentRoomButton).toHaveClass("secondary");
    expect(otherRoomButton).toHaveClass("outline");
  });

  it("calls onSelectRoom when a room button is clicked", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const randomButton = screen.getByText("random");
    fireEvent.click(randomButton);

    expect(mockOnSelectRoom).toHaveBeenCalledWith("random");
  });

  it("renders input field for new room creation", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    expect(screen.getByPlaceholderText("New room name")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("disables create button when input is empty", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const createButton = screen.getByText("Create");
    expect(createButton).toBeDisabled();
  });

  it("enables create button when input has value", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const input = screen.getByPlaceholderText("New room name");
    const createButton = screen.getByText("Create");

    fireEvent.change(input, { target: { value: "new-room" } });

    expect(createButton).not.toBeDisabled();
  });

  it("calls onCreateRoom when create button is clicked with valid input", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const input = screen.getByPlaceholderText("New room name");
    const createButton = screen.getByText("Create");

    fireEvent.change(input, { target: { value: "new-room" } });
    fireEvent.click(createButton);

    expect(mockOnCreateRoom).toHaveBeenCalledWith("new-room");
  });

  it("clears input after creating a room", async () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const input = screen.getByPlaceholderText("New room name");
    const createButton = screen.getByText("Create");

    fireEvent.change(input, { target: { value: "new-room" } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("does not call onCreateRoom with empty or whitespace-only input", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const input = screen.getByPlaceholderText("New room name");
    const createButton = screen.getByText("Create");

    // Try with empty string
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(createButton);
    expect(mockOnCreateRoom).not.toHaveBeenCalled();

    // Try with whitespace
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(createButton);
    expect(mockOnCreateRoom).not.toHaveBeenCalled();
  });

  it("trims whitespace from room name when creating", () => {
    render(
      <RoomList
        rooms={mockRooms}
        currentRoom="general"
        onSelectRoom={mockOnSelectRoom}
        onCreateRoom={mockOnCreateRoom}
      />
    );

    const input = screen.getByPlaceholderText("New room name");
    const createButton = screen.getByText("Create");

    fireEvent.change(input, { target: { value: "  trimmed-room  " } });
    fireEvent.click(createButton);

    expect(mockOnCreateRoom).toHaveBeenCalledWith("trimmed-room");
  });
});
