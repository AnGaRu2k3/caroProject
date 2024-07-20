
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useSocket } from '@/app/socket';


export default function Home() {
  const socket = useSocket();
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    if (socket) {
      console.log(socket.id)
      // Lắng nghe sự kiện 'start_game'
      socket.on('start_game', (data) => {
        console.log(data)
        router.push(`/game/${data.roomId}`);
      });

      // Dọn dẹp khi component unmount
      return () => {
        socket.off('start_game');
      };
    }
  }, [socket, router]);
  const handleJoinGame = () => {
    if (nickname && gender) {
      socket.emit('join_game', { nickname, gender });
      setWaiting(true);
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
        {waiting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex items-center space-x-4">
            <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <p className="text-4xl text-white">Waiting for other player</p>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
