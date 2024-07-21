
import React, { useState, useEffect } from 'react';
import Square from "./Square"
import PlayerCard from "./PlayerCard"
import { useSocket } from '@/app/socket';

const Board = ({ gameId, player, opponent }) => {
    const boardSize = 20
    const socket = useSocket();
    const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(null));
    const [xIsNext, setXIsNext] = useState(false);
    const [winner, setWinner] = useState(null);
    const directions = [-boardSize, boardSize, -1, 1, //up down left right 
    -boardSize - 1, boardSize + 1, -boardSize + 1, boardSize - 1] // upleft  downright upright downleft
    useEffect(() => {
        socket.on('move_made', ({ squares, xIsNext, i }) => {
            setSquares(squares);
            // calculateWinner(i, xIsNext == true ? 'O' : 'X', squares) 
            if (calculateWinner(i, xIsNext == true ? 'X' : 'O', squares) == true) {
                if (player.isX == xIsNext) setWinner(1)
                else setWinner(0)
            }
            setXIsNext(xIsNext);
        });
        return () => {
            socket.off('move_made');
        };
    }, [socket, player]);
    const calculateWinner = (i, value, squares) => {

        console.log(i, value)
        const edgeDirections = [
            Math.floor(i / boardSize), boardSize - Math.floor(i / boardSize) - 1, // up, down
            i % boardSize, boardSize - i % boardSize - 1, // left, right
            Math.min(Math.floor(i / boardSize), i % boardSize), // upleft
            Math.min(boardSize - Math.floor(i / boardSize) - 1, boardSize - i % boardSize - 1), // downright
            Math.min(Math.floor(i / boardSize), boardSize - i % boardSize - 1), // upright
            Math.min(boardSize - Math.floor(i / boardSize) - 1, i % boardSize), // downleft
        ];
        console.log("edgeDirections is", edgeDirections)
        let maxCells = Array(8).fill(0)
        directions.forEach((direction, index) => {
            const edgeDirection = edgeDirections[index];
            let cell = i
            for (let j = 0; j < edgeDirection; j++) {
                cell += direction;
                // console.log(squares[cell], squares[i])
                if (squares[cell] == value) maxCells[index]++;
                else break;
            }
        });
        console.log("maxCells is", maxCells)
        for (let d = 0; d < 4; d++) {
            const winCondition = maxCells[d * 2] + maxCells[d * 2 + 1] + 1;
            if (winCondition >= 5) return true
        }
        return false

    };
    const handleClick = (i) => {
        console.log(player, xIsNext)
        if (player.isX == xIsNext) return;
        if (squares[i] != null) return;
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'O' : 'X';
        socket.emit('make_move', { gameId, squares: newSquares, xIsNext: !xIsNext, i: i });

    };
    const renderSquare = (i) => {
        return <Square value={squares[i]} key={i} onClick={() => handleClick(i)} />;
    };
    const renderRow = (rowIndex) => {
        const rowSquares = [];
        for (let i = 0; i < boardSize; i++) {
            rowSquares.push(renderSquare(rowIndex * boardSize + i));
        }
        return (
            <div className="flex" key={rowIndex}>
                {rowSquares}
            </div>
        );
    };
    const renderBoard = () => {
        const rows = [];
        for (let i = 0; i < boardSize; i++) {
            rows.push(renderRow(i));
        }
        return rows;
    };
    const handleCountdownComplete = () => {
        if (player.isX == xIsNext) setWinner(1)
        else setWinner(0)
    }
    return (
        <>
            <div className="relative flex">
                {/* Component bên trái */}
                <div className="flex-1 ">
                    <PlayerCard info={player} isCurrentTurn={winner == null && player?.isX != xIsNext} onCountDownComplete={handleCountdownComplete} />
                </div>

                <div className={`relative ${winner != null ? 'opacity-50' : ''}`}>
                    {renderBoard()}
                </div>

                {/* Component bên phải */}
                <div className="flex-1">
                    <PlayerCard info={opponent} isCurrentTurn={winner == null && player?.isX == xIsNext} onCountDownComplete={handleCountdownComplete}  />
                </div>
            </div>
            {winner == 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex flex-col bg-white bg-opacity-60 p-4 items-center justify-center">
                        <div className="text-7xl font-bold text-green-500">
                            You win
                        </div>
                        <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg
                        text-sm px-5 py-2.5 text-center me-2 mb-2 mt-20 w-full">Play Again</button>
                        <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg
                        text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 w-full">New Match</button>

                    </div>
                    

                </div>
            )}
            {winner == 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex flex-col bg-white bg-opacity-60 p-4 items-center justify-center">
                    <div className="text-7xl font-bold text-red-500">
                        You lose
                    </div>
                    <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center me-2 mb-2 mt-20 w-full">Play Again</button>
                    <button type="button" class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg
                    text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 w-full">New Match</button>

                </div>
                

            </div>
            )}

        </>
    );
};

export default Board;