
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/playerSlice';

const Start = () => {
  const [nickName, setNickName] = useState('');
  const [color, setColor] = useState('#ff0000');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedNickName = localStorage.getItem('nickname');
    const savedColor = localStorage.getItem('color') || '#ff0000';

    if (savedNickName) {
      dispatch(login({ name: savedNickName, color: savedColor }));
      navigate('/game');
    }
  }, [dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickName.trim()) return;

    localStorage.setItem('nickname', nickName);
    localStorage.setItem('color', color);
    dispatch(setPlayer({ name: nickName, color }));
    navigate('/game');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-base-300 w-96 p-10 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center">Welcome to Mars Game</h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="input input-primary"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          maxLength={12}
        />
        <label className="flex justify-between items-center">
          <span>Select color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 border cursor-pointer"
          />
        </label>
        <button type="submit" className="btn btn-primary text-white">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default Start;
