import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Loading from "./components/Loading";
import { socket } from "./socket";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CHECK_IN_GAME } from "./consts";

function App() {
  const [name, setName] = useState(localStorage.getItem("USER") || "");
  const [game, setGame] = useState();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

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

  //not used currently. Made for backend to double check if connected socket is in the game in case removed from game but player.socketId still there. If this happens, player should be able to close window and rejoin and the confirmInGame check will override playerAlreadyInGame.
  useEffect(() => {
    function emitInGame() {
      const loc = location.pathname.split("/")[1];
      const inGame = ["lobby", "game"].includes(loc);
      socket.emit("inGameUpdate", { socketId: socket.id, inGame });
    }
    socket.on(CHECK_IN_GAME, emitInGame);

    return () => {
      socket.off(CHECK_IN_GAME, emitInGame);
    };
  }, [location]);

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
      <Route path="/lobby/:id" element={<Lobby name={name} game={game} setGame={setGame} isConnected={isConnected} setError={setError} />} />
      <Route
        path="/game/:id"
        element={<Game name={name} game={game} setGame={setGame} isConnected={isConnected} error={error} setError={setError} />}
      />
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
}

export default App;
