
'use client'
import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation'
const socket = io('http://localhost:3001');

export default function Home() {
  const router = useRouter()
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');

  const handleJoinGame = () => {
    if (nickname && gender) {
      socket.emit('join_game', { nickname, gender });
      socket.on('start_game', (data) => {
        router.push(`/game/${data.roomId}`)
      });
    } else {
      alert('Please enter a nickname and select a gender');
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center pt-10">
        <h1 className="text-green-500 text-9xl">𝓒𝓪𝓻𝓸 𝓞𝓷𝓵𝓲𝓷𝓮</h1>
        <input
          className="mt-40 w-1/4 h-16 border text-2xl rounded-3xl bg-purple-800 px-5"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <div className="flex justify-center gap-20 w-full mt-12">
          <button
            className={`rounded-3xl w-1/12 h-16 border ${gender === 'male' ? 'bg-blue-600 text-white' : 'border-blue-600 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
              } flex items-center justify-center transition duration-300 ease-in-out`}
            onClick={() => setGender('male')}
          >
            male
          </button>
          <button
            className={`rounded-3xl w-1/12 h-16 border ${gender === 'female' ? 'bg-pink-600 text-white' : 'border-pink-600 bg-pink-100 text-pink-600 hover:bg-pink-600 hover:text-white'
              } flex items-center justify-center transition duration-300 ease-in-out`}
            onClick={() => setGender('female')}
          >
            female
          </button>
        </div>
        <button
          className="mt-10 w-40 h-20 text-3xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={handleJoinGame}
        >
          Play
        </button>
      </div>
    </>
  );
}
