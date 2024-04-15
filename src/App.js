import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Loading from "./components/Loading";
import { socket } from "./socket";
import { Routes, Route } from "react-router-dom";

function App() {
  const [name, setName] = useState(localStorage.getItem("USER") || "");
  const [game, setGame] = useState();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect", () => {
        setIsConnected(true);
      });
      socket.off("disconnect", () => {
        setIsConnected(false);
      });
    };
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll("img");
    images.forEach(img => img.setAttribute("draggable", "false"));
  }, [game]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            name={name}
            setName={setName}
            setGame={setGame}
            isConnected={isConnected}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
        }
      />
      <Route path="/join" element={<Join name={name} setIsLoading={setIsLoading} isConnected={isConnected} error={error} setError={setError} />} />
      <Route path="/lobby/:id" element={<Lobby name={name} game={game} setGame={setGame} isConnected={isConnected} />} />
      <Route
        path="/game/:id"
        element={<Game name={name} game={game} setGame={setGame} isConnected={isConnected} error={error} setError={setError} />}
      />
    </Routes>
  );
}

export default App;
