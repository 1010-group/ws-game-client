
// === Game.jsx ===
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../socket';
import { incrementScore } from '../redux/playerSlice';

const Game = () => {
  const { name, color, score } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [players, setPlayers] = useState({});
  const [playerId, setPlayerId] = useState(null);
  const [food, setFood] = useState({ x: 300, y: 200 });

  useEffect(() => {
    socket.on('connect', () => {
      setPlayerId(socket.id);
      socket.emit('joinGame', {
        name,
        color,
        position: { x: 100, y: 100 },
      });
    });

    socket.on('playerJoined', (player) => {
      setPlayers((prev) => ({ ...prev, [player.id]: player }));
    });

    socket.on('playerMoved', ({ id, position }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], position },
      }));
    });

    const gameField = document.querySelector('.game-field');
    const handleKeyDown = (event) => {
      const keys = {
        w: 'up',
        a: 'left',
        s: 'down',
        d: 'right',
      };
      const direction = keys[event.key];
      if (direction) move(direction);
    };
    gameField?.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off();
      gameField?.removeEventListener('keydown', handleKeyDown);
    };
  }, [name, color]);

  const move = (direction) => {
    const player = players[playerId];
    if (!player) return;

    let { x, y } = player.position;
    switch (direction) {
      case 'up': y = Math.max(0, y - 10); break;
      case 'down': y = Math.min(470, y + 10); break;
      case 'left': x = Math.max(0, x - 10); break;
      case 'right': x = Math.min(970, x + 10); break;
    }

    const newPos = { x, y };
    socket.emit('move', { id: playerId, position: newPos });

    if (Math.abs(x - food.x) < 30 && Math.abs(y - food.y) < 30) {
      setFood({ x: Math.random() * 970, y: Math.random() * 470 });
      dispatch(incrementScore());
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center">🚀 Mars Game - Score: {score}</h1>
      <div
        className="mt-4 border relative bg-gray-100 game-field"
        style={{ width: '1000px', height: '500px', overflow: 'hidden' }}
        tabIndex={0}
      >
        {Object.entries(players).map(([id, player]) => (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${player?.position?.x}px`,
              top: `${player?.position?.y}px`,
              backgroundColor: player.color,
              width: 30 + (id === playerId ? score * 2 : 0),
              height: 30 + (id === playerId ? score * 2 : 0),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '10px',
            }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-black text-xs">
              {player.name}
            </span>
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            left: food.x,
            top: food.y,
            width: '20px',
            height: '20px',
            backgroundColor: 'green',
            borderRadius: '50%',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Game;
