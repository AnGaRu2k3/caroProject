import React, { useState } from 'react';

const PlayerCard = () => {
  
  return (
    <>
        <div className="player-card h-full bg-blue-400">
            <div className="flex flex-col items-center ">
               <img src="/images/man.png" className=' mt-28 p-1 border border-4 border-black size-2/3'></img>
               <span className="mt-10 text-5xl break-words w-60 max-w-full text-center"> dfdsaffdafdafdafdasfdafdad </span>
               <img src="/images/o.png" className=' size-2/3'></img>
            </div>
        </div>
    </>
  );
};
export default PlayerCard;