import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api/api";
import { socket } from "../socket";
import { Status } from "../consts";
import { Box, TextField, Button } from "@mui/material";
import SnackBarError from "../components/SnackBarError";

export default function Join({ name, setIsLoading, isConnected, error, setError }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");

  async function handleJoin() {
    try {
      setIsLoading(true);
      const res = await post(`/game/join/${id}`, {
        name,
        socketId: socket.id,
      });
      setIsLoading(false);
      const game = res.data;
      if (game.status === Status.CREATED) {
        navigate(`/lobby/${id}`);
      } else {
        navigate(`/game/${id}`);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err?.response?.data?.message || `Cannot join a game ${!isConnected ? `while offline.` : `at this time.`}`);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          <TextField autoFocus label="Game ID" value={id} onChange={e => setId(e.target.value.toUpperCase())} fullWidth required />
          <Button type="submit" fullWidth variant="contained" disabled={id.length !== 4} onClick={handleJoin} sx={{ marginTop: "8px" }}>
            Join Game
          </Button>
        </form>
      </Box>
      <SnackBarError error={error} setError={setError} />{" "}
    </Box>
  );
}
