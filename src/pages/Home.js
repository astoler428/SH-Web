import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { post } from "../api/api";
import { Typography, CssBaseline, Box, TextField, Button } from "@mui/material";

export default function Home({ name, setName, isConnected, setIsLoading }) {
  const navigate = useNavigate();
  const nameInputRef = useRef();
  const [showConnectStatus, setShowConnectionStatus] = useState(false);

  async function createGame() {
    try {
      setIsLoading(true);
      const res = await post("/game", { name, socketId: socket.id });
      setIsLoading(false);
      const id = res.data;
      navigate(`/lobby/${id}`);
    } catch (err) {
      setIsLoading(false);
      console.error(err.response?.data.message);
    }
  }

  function handleInputChange(e) {
    localStorage.setItem("USER", e.target.value);
    setName(e.target.value);
  }
  useEffect(() => {
    nameInputRef.current.focus();
    nameInputRef.current.select();
    setTimeout(() => setShowConnectionStatus(true), 500);
  }, []);

  return (
    <>
      {showConnectStatus && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: 12,
              top: 16,
              borderRadius: 100,
              backgroundColor: isConnected ? "#3BDC3B" : "#F22615",
              width: 16,
              height: 16,
            }}
          ></Box>

          <Typography
            sx={{
              position: "absolute",
              left: 30,
              top: 11,
            }}
          >
            {isConnected ? "online" : "offline"}
          </Typography>
        </>
      )}
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: 320,
            gap: 2,
          }}
        >
          <form onSubmit={e => e.preventDefault()}>
            <TextField required inputRef={nameInputRef} label="Name" fullWidth value={name} onChange={handleInputChange} />
            <Button type="submit" disabled={!name} onClick={createGame} fullWidth variant="contained" sx={{ margin: "8px 0 4px 0" }}>
              Create Game
            </Button>
            <Button disabled={!name} onClick={() => navigate("/join")} variant="outlined" fullWidth>
              Join Game
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}
