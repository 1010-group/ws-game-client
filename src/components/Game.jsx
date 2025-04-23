import React, { useEffect, useState } from "react";
import socket from "../socket";

const Game = ({ playerInfo }) => {
  const [players, setPlayers] = useState({});
  const [playerId, setPlayerId] = useState(null);

  // Check for localStorage if playerInfo is not passed
  const storedNickName = localStorage.getItem("nickname");
  const storedColor = localStorage.getItem("color");

  const currentPlayerInfo = playerInfo || {
    name: storedNickName || "Guest", // Default to "Guest" if no name
    color: storedColor || "#ff0000", // Default color if not found
  };

  useEffect(() => {
    socket.on("connect", () => {
      setPlayerId(socket.id);

      const newPlayer = {
        id: socket.id,
        name: currentPlayerInfo.name,
        color: currentPlayerInfo.color,
        position: { x: 100, y: 100 },
      };

      socket.emit("joinGame", newPlayer);
    });

    socket.on("playerJoined", (player) => {
      setPlayers((prev) => ({ ...prev, [player.id]: player }));
    });

    socket.on("playerMoved", ({ id, position }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], position },
      }));
    });

    socket.on("playerLeft", (id) => {
      setPlayers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    // Add keyboard event listeners
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      socket.off("connect");
      socket.off("playerJoined");
      socket.off("playerMoved");
      socket.off("playerLeft");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPlayerInfo]);

  const move = (direction) => {
    const currentPlayer = players[playerId];
    if (!currentPlayer) return;

    const { x, y } = currentPlayer.position;
    let newPos = { x, y };

    if (direction === "up") newPos.y -= 10;
    if (direction === "down") newPos.y += 10;
    if (direction === "left") newPos.x -= 10;
    if (direction === "right") newPos.x += 10;

    socket.emit("move", { id: playerId, position: newPos });
  };

  if (!playerId) return null; // Agar playerId bo'lmasa, hech narsa ko'rsatilmasin

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Multiplayer Mars Game</h1>

      <div className="mt-4 border relative" style={{ width: "100%", height: "500px" }}>
        {Object.entries(players).map(([id, player]) => {
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left: `${player.position.x}px`,
                top: `${player.position.y}px`,
                backgroundColor: player.color,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "10px",
              }}
              title={player?.name || "Unknown Player"}
            >
              <div className="relative">
                <span className="absolute -top-8 -left-0 -translate-x-1/2">
                  {player?.name || "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
