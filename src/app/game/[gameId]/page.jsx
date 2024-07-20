
'use client'
import Board from '@/components/Board'; //
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/app/socket';

const GamePage = ({params}) => {
 
  const socket = useSocket();
  
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const {gameId} = params
 

  useEffect(() => {
    console.log("Component mounted, gameId:", gameId);
    socket.emit('get_room_information', gameId);
    socket.on('room_information', (playersInfo) => {  
        setPlayer(playersInfo.player)
        setOpponent(playersInfo.opponent)
    });
    return () => {
        socket.off('room_information');
    };
}, [gameId]); 
  return (
    <div>
      <Board gameId = {gameId} player={player} opponent={opponent}/>
    </div>
  );
};

export default GamePage;