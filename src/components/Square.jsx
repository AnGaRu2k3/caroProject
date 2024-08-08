import React, { useState, useEffect } from 'react';

const Square = React.memo(({ playerTurn, value, onClick, player }) => {
  const [hoveredValue, setHoveredValue] = useState(null);
  let colorHoveredValue = (player == 'X') ? 'text-red-400' : 'text-blue-400'
  useEffect(() => {
    if (value === null) {
      setHoveredValue(null);
    }
  }, [value])
  
  const getColorClass = (value) => {
    if (value == 'O') {
      return 'text-blue-600'
    } else if (value == 'X') {
      return 'text-red-600';
    }
    return '';
  };

  const handleMouseEnter = () => {

    setHoveredValue(player);
  };

  const handleMouseLeave = () => {

    setHoveredValue(null);
  };

  return (
    <button
      className="w-10 h-10 border border-orange-400 bg-white flex items-center justify-center text-4xl relative"
      onClick={onClick}
      onMouseEnter={playerTurn ? handleMouseEnter : null}
      onMouseLeave={playerTurn ? handleMouseLeave : null}
    >
      <span className={`${getColorClass(value)} absolute`}>{value}</span>
      {hoveredValue != null && value == null && (
        <span className={`${colorHoveredValue} absolute`}>{hoveredValue}</span>
      )}
    </button>
  );
});

export default Square;
