
import React, { useState, useEffect } from 'react';
import Square from "./Square"
import PlayerCard from "./PlayerCard"
import { useSocket } from '@/app/socket';

const Board = ({ gameId, player, opponent }) => {
    const boardSize = 20
    const socket = useSocket();
    const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const directions = [-boardSize, boardSize, -1, 1, //up down left right 
    -boardSize - 1, boardSize + 1, -boardSize + 1, boardSize - 1] // upleft  downright upright downleft
    useEffect(() => {
        socket.on('move_made', ({ squares, xIsNext }) => {
            setSquares(squares);
            setXIsNext(xIsNext);
        });

        return () => {
            socket.off('move_made');
        };
    }, [socket]);
    const calculateWinner = (i, value) => {
        console.log(value)
        console.log(i)
        const edgeDirections = [
            Math.floor(i / boardSize), boardSize - Math.floor(i / boardSize) - 1, // up, down
            i % boardSize, boardSize - i % boardSize - 1, // left, right
            Math.min(Math.floor(i / boardSize), i % boardSize), // upleft
            Math.min(boardSize - Math.floor(i / boardSize) - 1, boardSize - i % boardSize - 1), // downright
            Math.min(Math.floor(i / boardSize), boardSize - i % boardSize - 1), // upright
            Math.min(boardSize - Math.floor(i / boardSize) - 1, i % boardSize), // downleft
        ];
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
        newSquares[i] = xIsNext ? 'X' : 'O';
        socket.emit('make_move', { gameId, squares: newSquares, xIsNext: !xIsNext });

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
                    <PlayerCard info={player} isCurrentTurn={player?.isX != xIsNext} onCountDownComplete={handleCountdownComplete} />
                </div>

                <div className={`relative ${winner ? 'opacity-50' : ''}`}>
                    {renderBoard()}
                </div>

                {/* Component bên phải */}
                <div className="flex-1">
                    <PlayerCard info={opponent} isCurrentTurn={player?.isX == xIsNext} onCountDownComplete={handleCountdownComplete}  />
                </div>
            </div>
            {winner == 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-60 p-4">
                        <div className="text-4xl font-bold text-green-500">
                            You win
                        </div>
                    </div>
                </div>
            )}
            {winner == 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-60 p-4">
                        <div className="text-4xl font-bold text-red-500">
                            You lose
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Board;