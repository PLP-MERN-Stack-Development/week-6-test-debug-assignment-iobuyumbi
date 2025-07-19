import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
          <header className="w-full py-4 bg-white shadow text-center text-2xl font-bold">
            Real-Time Chat App
          </header>
          <main className="flex-1 w-full max-w-2xl p-4">
            <Routes>
              <Route path="/" element={<ChatPage />} />
            </Routes>
          </main>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </SocketProvider>
  );
}
