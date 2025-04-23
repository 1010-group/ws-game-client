import React, { useEffect, useState } from "react";
import socket from "../socket";

const Game = ({ playerInfo }) => {
  const [players, setPlayers] = useState({});
  const [playerId, setPlayerId] = useState(null);
  const [isReady, setIsReady] = useState(false); // Новый флаг

  const storedNickName = localStorage.getItem("nickname");
  const storedColor = localStorage.getItem("color");

  const currentPlayerInfo = playerInfo || {
    name: storedNickName || "Guest",
    color: storedColor || "#ff0000",
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      setPlayerId(socket.id);

      const newPlayer = {
        name: currentPlayerInfo.name,
        color: currentPlayerInfo.color,
        position: { x: 100, y: 100 },
      };

      socket.emit("joinGame", newPlayer);
    });

    socket.on("playerJoined", (player) => {
      console.log("🎮 Player joined:", player);
      setPlayers((prev) => {
        const updated = { ...prev, [player.id]: player };
        // Проверяем, готов ли текущий игрок
        if (player.id === socket.id && socket.id) {
          setIsReady(true);
        }
        return updated;
      });
    });

    socket.on("playerMoved", ({ id, position }) => {
      console.log("🚶 Player moved:", { id, position });
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], position },
      }));
    });

    socket.on("playerLeft", (id) => {
      console.log("❌ Player left:", id);
      setPlayers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    const handleKeyDown = (event) => {
      event.preventDefault();
      console.log("Key pressed:", event.key);
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
      socket.off("connect_error");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPlayerInfo]);

  const move = (direction) => {
    if (!isReady || !playerId || !players[playerId]) {
      console.warn("Player not ready or playerId not set");
      return;
    }

    const currentPlayer = players[playerId];
    if (!currentPlayer.position) {
      console.warn("Player position not initialized");
      return;
    }

    const { x, y } = currentPlayer.position;
    let newPos = { x, y };

    switch (direction) {
      case "up":
        newPos.y = Math.max(0, y - 10);
        break;
      case "down":
        newPos.y = Math.min(470, y + 10);
        break;
      case "left":
        newPos.x = Math.max(0, x - 10);
        break;
      case "right":
        newPos.x = Math.min(970, x + 10);
        break;
      default:
        break;
    }

    console.log("Sending move:", { id: playerId, position: newPos });
    socket.emit("move", { id: playerId, position: newPos });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">🚀 Multiplayer Mars Game</h1>
      <div
        className="mt-4 border relative bg-gray-100"
        style={{ width: "1000px", height: "500px", overflow: "hidden" }}
      >
        {Object.entries(players).map(([id, player]) => (
          <div
            key={id}
            style={{
              position: "absolute",
              left: `${player.position?.x || 0}px`,
              top: `${player.position?.y || 0}px`,
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
            title={player?.name || "Unknown"}
          >
            <div className="relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-black text-xs font-medium">
                {player?.name || "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => move("right")} className="btn btn-primary mt-4">
        Move Right
      </button>
    </div>
  );
};

export default Game;