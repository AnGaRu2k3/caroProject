'use client'
import React, { useState, useEffect } from 'react';
import Square from "./Square"
import PlayerCard from "./PlayerCard"
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001');

const Board = ({gameId}) => {
    
    const boardSize = 20
    const [squares, setSquares] = useState(Array(boardSize * boardSize).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const directions = [-boardSize, boardSize, -1, 1, //up down left right 
    -boardSize - 1, boardSize + 1, -boardSize + 1, boardSize - 1] // upleft  downright upright downleft
    useEffect(() => {
        console.log("Component mounted, gameId:", gameId);
        socket.emit('get_room_information', gameId);
        socket.on('room_information', (data) => {
            console.log(data);
            // updatePlayerCards(data);
        });
        return () => {
            socket.off('room_information');
        };
    }, [gameId]); 
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
        if (squares[i] != null) return;
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(newSquares);
        if (calculateWinner(i, (xIsNext) ? 'X' : 'O')) {
            console.log("winner is ", xIsNext)
            setWinner((xIsNext) ? 'X' : 'O')
        }
        setXIsNext(!xIsNext);
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

    return (
        <>
            <div className="relative flex">
                {/* Component bên trái */}
                <div className="flex-1 ">
                    <PlayerCard />
                </div>

                <div className={`relative ${winner ? 'opacity-50' : ''}`}>
                    {renderBoard()}
                </div>

                {/* Component bên phải */}
                <div className="flex-1">
                    <PlayerCard />
                </div>
            </div>
            {winner && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-60 p-4">
                        <div className="text-4xl font-bold text-green-500">
                            {winner} is winning
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Board;