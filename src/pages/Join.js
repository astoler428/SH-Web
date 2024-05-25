import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client, { post } from "../api/api";
import { socket } from "../socket";
import { EXISTING_GAMES, Status } from "../consts";
import { Box, TextField, Button } from "@mui/material";
import SnackBarError from "../components/SnackBarError";
import useCustomThrottle from "../hooks/useCustomThrottle";

export default function Join({ name, setIsLoading, isConnected, error, setError }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [existingGameIds, setExistingGameIds] = useState([]);
  const throttledHandleJoin = useCustomThrottle(handleJoin);

  async function handleJoin() {
    //currently removed loading conditional from App.js
    try {
      setIsLoading(true);
      const res = await client.post(`/game/join/${id}`, {
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
      console.error(err);
      console.error(err?.response?.data?.message);
      setError(err?.response?.data?.message || `Cannot join a game ${!isConnected ? `while offline.` : `at this time.`}`);
    }
  }

  useEffect(() => {
    socket.on(EXISTING_GAMES, existingGameIds => setExistingGameIds(existingGameIds));
    getExistingGames();
    async function getExistingGames() {
      await post("/game/existingGames");
    }
    return () => socket.off(EXISTING_GAMES, existingGameIds => setExistingGameIds(existingGameIds));
  }, []);

  return (
    <>
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
            <TextField autoFocus label="Game ID" value={id} onChange={e => setId(e.target.value.toUpperCase())} fullWidth required />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={id.length !== 4 || !existingGameIds?.includes(id)}
              onClick={throttledHandleJoin}
              sx={{ marginTop: "8px" }}
            >
              Join Game
            </Button>
          </form>
        </Box>
      </Box>
      <SnackBarError error={error} setError={setError} />
    </>
  );
}
