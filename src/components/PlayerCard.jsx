import React, { useState, useEffect } from 'react';
import CircleDownCircle from "./CircleCountDown";
const PlayerCard = ({ info, isCurrentTurn, onCountDownComplete}) => {
  const [playerInfo, setPlayerInfo] = useState(info);

  useEffect(() => {
    if (info) {
      setPlayerInfo(info);
    }
  }, [info]);
  const avatarSrc = playerInfo?.gender === 'male' ? '/images/male.png' : '/images/female.png';
  const backgroundColor = playerInfo?.isX ? 'bg-red-400' : 'bg-blue-400';
  const symbolSrc = playerInfo?.isX ? '/images/x.png' : '/images/o.png';
  return (
    <div className={`player-card h-full ${backgroundColor}`}>
      <div className="flex flex-col p-5 items-center">


        <div className="relative w-48 h-48 flex items-center justify-center">
          {isCurrentTurn ? (
            <CircleDownCircle time={3} size={180} stroke="#90ee90" strokeWidth={6} onComplete={onCountDownComplete}>
              <img src={avatarSrc} className="border- rounded-full object-cover border-black w-40 h-40 absolute" alt="Avatar" />
            </CircleDownCircle>
          ) : (
            <img src={avatarSrc} className="rounded-full object-cover border-black w-40 h-40 absolute" alt="Avatar" />
          )}
        </div>
        <span className="mt-20 text-5xl break-words w-60 max-w-full text-center ">{playerInfo?.nickname}</span>
        <img src={symbolSrc} className="mt-60 size-2/3" alt="Symbol" />
      </div>
    </div>
  );
};

export default PlayerCard;
