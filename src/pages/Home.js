import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import client, { post } from "../api/api";
import { Typography, CssBaseline, Box, TextField, Button, Snackbar } from "@mui/material";
import SnackBarError from "../components/SnackBarError";
import useCustomThrottle from "../hooks/useCustomThrottle";

export default function Home({ name, setName, isConnected, setIsLoading, error, setError }) {
  const navigate = useNavigate();
  const nameInputRef = useRef();
  const [showConnectStatus, setShowConnectionStatus] = useState(false);
  const throttledCreateGame = useCustomThrottle(createGame);

  async function createGame() {
    //currently removed loading conditional from App.js
    try {
      setIsLoading(true);
      const res = await client.post("/game", { name, socketId: socket.id });
      setIsLoading(false);
      const id = res.data;
      if (id) {
        //if create too quickly back to back, !acceptingResponses returns null
        navigate(`/lobby/${id}`);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      console.error(err?.response?.data?.message);
      setError(err?.response?.data?.message || `Cannot create a game ${!isConnected ? `while offline.` : `at this time.`}`);
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
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
            <TextField inputRef={nameInputRef} label="Name" fullWidth value={name} onChange={handleInputChange} />
            <Button type="submit" disabled={!name} onClick={throttledCreateGame} fullWidth variant="contained" sx={{ margin: "8px 0 4px 0" }}>
              Create Game
            </Button>
            <Button disabled={!name} onClick={() => navigate("/join")} variant="outlined" fullWidth>
              Join Game
            </Button>
          </form>
        </Box>
      </Box>
      <SnackBarError error={error} setError={setError} />
    </>
  );
}
