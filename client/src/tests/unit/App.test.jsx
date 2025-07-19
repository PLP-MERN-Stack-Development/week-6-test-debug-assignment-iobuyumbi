// client/src/tests/unit/App.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../../App";

// Mock the components and context
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
}));

jest.mock("../../context/SocketContext", () => ({
  SocketProvider: ({ children }) => (
    <div data-testid="socket-provider">{children}</div>
  ),
}));

jest.mock("../../pages/ChatPage", () => {
  return function MockChatPage() {
    return <div data-testid="chat-page">Chat Page</div>;
  };
});

jest.mock("../../components/ui/sonner", () => ({
  Toaster: ({ position }) => (
    <div data-testid="toaster" data-position={position}>
      Toaster
    </div>
  ),
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);

    expect(screen.getByTestId("router")).toBeInTheDocument();
    expect(screen.getByTestId("socket-provider")).toBeInTheDocument();
    expect(screen.getByTestId("chat-page")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("renders the header with correct text", () => {
    render(<App />);

    expect(screen.getByText("Real-Time Chat App")).toBeInTheDocument();
  });

  it("renders the main content area", () => {
    render(<App />);

    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass("flex-1", "w-full", "max-w-2xl", "p-4");
  });

  it("renders the toaster with correct position", () => {
    render(<App />);

    const toaster = screen.getByTestId("toaster");
    expect(toaster).toHaveAttribute("data-position", "top-right");
  });

  it("has the correct overall structure", () => {
    render(<App />);

    // Check for the main container
    const container = screen.getByText("Real-Time Chat App").closest("div");
    expect(container).toHaveClass(
      "min-h-screen",
      "bg-gray-100",
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );
  });
});
