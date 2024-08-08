'use client'
import Board from '@/components/Board';
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/app/socket';

const GamePage = ({ params }) => {
  const socket = useSocket();
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [opponentIsWaiting, setOpponentIsWaiting] = useState(false);

  const { gameId } = params;
  console.log(player, opponent)
  useEffect(() => {
    console.log(isWaiting, opponentIsWaiting)
    if (isWaiting && opponentIsWaiting) {
      console.log("DA RESETGAME")
      console.log(isWaiting, opponentIsWaiting)
      setIsWaiting(false);
      setOpponentIsWaiting(false)
      resetGame();
    }
  }, [isWaiting, opponentIsWaiting]);
  useEffect(() => {
    console.log("Component mounted, gameId:", gameId);
    socket.emit('get_room_information', gameId);
    socket.on('room_information', (playersInfo) => {
      console.log(playersInfo)
      setPlayer(playersInfo.player);
      setOpponent(playersInfo.opponent);
    });
    socket.on('opponent_ready', () => {
      console.log("opponent is ready")
      setOpponentIsWaiting(true);
    });
    socket.on('opponent_cancel', () => {
      setOpponentIsWaiting(false);
    });
    return () => {
      socket.off('room_information');
      socket.off('opponent_ready');
      socket.off('opponent_cancel');

    };
  }, [gameId]);

  const handleGameEnd = (winner) => {
    setWinner(winner);
  };
  const handlePlayAgain = () => {
    setIsWaiting(true);
    socket.emit('player_ready', gameId);
  };

  const handleCancelWait = () => {
    setIsWaiting(false);
    socket.emit('cancel_ready', gameId);
  };
  const resetGame = () => {
    setWinner(null);
    setPlayer(prevPlayer => ({ ...prevPlayer, isX: prevPlayer.isX === 1 ? 0 : 1 }));
    setOpponent(prevOpponent => ({ ...prevOpponent, isX: prevOpponent.isX === 1 ? 0 : 1 }));
  };

  return (
    <div>
      <Board
        gameId={gameId}
        player={player}
        opponent={opponent}
        onGameEnd={handleGameEnd}
        resetGame={resetGame}
        winner={winner}
      />
      {winner !== null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col bg-white bg-opacity-60 p-4 items-center justify-center">
            <div className={`text-7xl font-bold ${winner === 1 ? 'text-green-500' : 'text-red-500'}`}>
              {winner === 1 ? 'You win' : 'You lose'}
            </div>
            {isWaiting ? (
              <button type="button" onClick={handleCancelWait} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-20 w-full">
                Cancel
              </button>
            ) : (
              <button type="button" onClick={handlePlayAgain} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-20 w-full">
                Play Again
              </button>
            )}
            <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 w-full">New Match</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
